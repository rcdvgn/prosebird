"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import _ from "lodash";
import calculateTimestamps from "@/app/_lib/addTimestamps";

import getPositionFromTimestamp from "../_utils/getPositionFromTimestamp";

import {
  getRealtimeNodes,
  getPeople,
  subscribeToPresentation,
  managePresence,
} from "../_services/client";

interface PusherMember {
  id: string;
  info?: any;
}

interface PusherMembers {
  count: number;
  members: { [key: string]: PusherMember };
  myID: string;
  get: (id: string) => PusherMember | null;
  each: (callback: (member: PusherMember) => void) => void;
}

const PresentationContext = createContext<any>(undefined);

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [presentationCode, setPresentationCode] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [presentation, setPresentation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<any>(0);
  const [scrollMode, setScrollMode] = useState<any>("continuous");
  const [isSeeking, setIsSeeking] = useState(false);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<any>(null);
  const [chaptersWithTimestamps, setChaptersWithTimestamps] =
    useState<any>(null);
  const [totalDuration, setTotalDuration] = useState<any>(null);
  const [progress, setProgress] = useState<any>({ line: 0, index: 0 });
  const [participants, setParticipants] = useState<any>([]);
  const [containerWidth, setContainerWidth] = useState<any>(520);
  const [isAutoscrollOn, setIsAutoscrollOn] = useState<boolean>(true);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );
  const [controller, setController] = useState<any>(null);
  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

  // const [pusherChannel, setPusherChannel] = useState<any>(null);

  const speedMultiplier = 1;
  const fontSize = "36";

  const getController = (currentPosition: any) => {
    let isController = false;
    let didControllerChange = false;

    if (!presentation || !speaker) return;
    const chapters = presentation?.nodes?.chapters;

    const chapterStartPositions = Object.keys(chapters);

    let correctLineSpeaker: any;

    for (let i = chapterStartPositions.length - 1; i >= 0; i--) {
      if (currentPosition >= chapterStartPositions[i]) {
        correctLineSpeaker = chapters[chapterStartPositions[i]].speaker;
        break;
      }
    }
    correctLineSpeaker === speaker?.id ? (isController = true) : "";

    if (!controller) {
      didControllerChange = true;
      setController({ current: correctLineSpeaker, previous: null });
    }

    if (correctLineSpeaker !== controller?.current) {
      didControllerChange = true;
      setController((previousController: any) => {
        return {
          current: correctLineSpeaker,
          previous: previousController?.current
            ? previousController?.current
            : null,
        };
      });
    }

    return { isController, didControllerChange };
  };

  const broadcastProgress = async ({ transcript }: any) => {
    let customParams = {};
    if (transcript) {
      const lastSpokenWords = transcript.split(" ").slice(-3);

      customParams = {
        words: presentation.nodes.words,
        lastSpokenWords: lastSpokenWords,
      };
    }

    try {
      const response = await fetch(
        `/api/presentation/${transcript ? "dynamically-" : ""}update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // presentationCode: presentationCode,
            presentationId: presentation.id,
            currentPosition:
              wordsWithTimestamps[progress.line][progress.index].position,
            userId: speaker.id,
            ...customParams,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating presentation:", error);
    }
  };

  // fetch presentation
  useEffect(() => {
    if (!presentationCode) return;
    if (!presentationCode.length) return;

    const validatePresentation = async () => {
      try {
        const response = await fetch("/api/presentation/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presentationCode }),
        });

        const data = await response.json();

        if (data?.presentation) {
          setPresentation(data.presentation);
          setLoading(false);
        } else {
          setError("Invalid or inactive presentation code.");
        }
      } catch (err) {
        console.error("Error validating presentation code:", err);
        setError("Error fetching presentation data.");
      }
    };

    validatePresentation();
  }, [presentationCode]);

  // generate wordsWithTimestamps
  useEffect(() => {
    const fetchWordsWithTimestamps = async () => {
      try {
        if (presentation) {
          const {
            scriptWithTimestamps,
            chaptersWithTimestamps: newChaptersWithTimestamps,
            totalDuration,
          } = await calculateTimestamps(
            presentation.nodes.words,
            presentation.nodes.chapters,
            containerWidth,
            speedMultiplier,
            fontSize
          );

          setTotalDuration(totalDuration);
          setWordsWithTimestamps(scriptWithTimestamps);
          setChaptersWithTimestamps(newChaptersWithTimestamps);
        }
      } catch (error) {
        console.error("Error fetching words with timestamps:", error);
      }
    };

    fetchWordsWithTimestamps();
  }, [presentation?.nodes, presentation?.id, containerWidth, speedMultiplier]);

  // watch nodes and presenation changes in realtime
  useEffect(() => {
    if (!presentation) return;
    const handlePresentationChanges: any = (latestPresentation: any) => {
      // console.log("Most recent presentation version: " + latestPresentation);

      setPresentation(latestPresentation);
    };

    const handleNodesChanges: any = (latestNodes: any) => {
      // console.log("Most recent nodes version: " + latestNodes);

      setRealtimeNodes(latestNodes);
    };

    const unsubscribePresentation: any = subscribeToPresentation(
      presentation?.id,
      handlePresentationChanges
    );

    const unsubscribeNodes: any = getRealtimeNodes(
      presentation?.scriptId,
      handleNodesChanges
    );

    return () => {
      unsubscribeNodes();
      unsubscribePresentation();
    };
  }, [presentation?.id]);

  useEffect(() => {
    if (!presentation || !speaker) return;

    const unsubscribe = managePresence(
      presentation.id,
      speaker,
      (updatedParticipants: any) => {
        console.log("Updated participants:", updatedParticipants);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [presentation?.id, speaker?.id]);

  // useEffect(() => {
  //   console.log(participants, speaker);
  // }, [participants, speaker]);

  // update participants and speaker variable in realtime
  useEffect(() => {
    if (!presentation) return;

    const participantsData = presentation.participants || [];

    if (!_.isEqual(participantsData, lastFetchedParticipants)) {
      // console.log("Change in participants, proceeding to fetch each individually");

      setLastFetchedParticipants(participantsData);

      const fetchParticipantDetails = async () => {
        try {
          const newParticipantsIds = Object.keys(participantsData);

          const userDocs = await getPeople(newParticipantsIds, []);

          const userDetailsMap = userDocs.reduce((acc, userDoc) => {
            acc[userDoc.id] = userDoc;
            return acc;
          }, {} as Record<string, any>);

          const enrichedParticipants = Object.entries(participantsData).map(
            ([participantId, participantData]: any) => {
              const userDetails = userDetailsMap[participantId];
              if (userDetails) {
                return {
                  id: participantId,
                  ...userDetails,
                  ...participantData,
                };
              }
              return { id: participantId, ...participantData };
            }
          );

          setParticipants(enrichedParticipants);

          // console.log("Participants just changed and now 'speaker' will too!");

          if (speaker) {
            // console.log(
            //   "It looks like youre a speaker already: " +
            //     JSON.stringify(speaker)
            // );
            if (newParticipantsIds.includes(speaker.id)) {
              // console.log("Youre still good, keep doing you b");

              const matchedSpeaker = enrichedParticipants.find(
                (participant: any) => participant.id === speaker.id
              );

              if (!_.isEqual(speaker, matchedSpeaker)) {
                // console.log("Your speaker object changed, look:");
                // console.log("Old you: " + JSON.stringify(speaker));
                // console.log("New you: " + JSON.stringify(matchedSpeaker));
              } else {
                // console.log(
                //   "Your speaker object was reset but didnt change a thing"
                // );
              }

              setSpeaker(matchedSpeaker || null);
            } else {
              // console.log("It seems that you are the idiot that got removed");

              setSpeaker(null);
            }
          } else {
            // console.log("It looks like you werent a speaker before, nevermind");
          }
        } catch (error) {
          console.error("Error fetching participant details:", error);
        }
      };

      fetchParticipantDetails();
    } else {
      // console.log("No change in participants");
    }
  }, [presentation?.participants]);

  // update progress based on elapsedTime
  useEffect(() => {
    if (!wordsWithTimestamps || isSeeking) return;

    const newProgress = getPositionFromTimestamp(
      wordsWithTimestamps,
      progress,
      elapsedTime
    );

    if (!_.isEqual(newProgress, progress)) {
      setProgress(newProgress);
    }
  }, [elapsedTime, isSeeking, wordsWithTimestamps]);

  return (
    <PresentationContext.Provider
      value={{
        presentationCode,
        setPresentationCode,
        presentation,
        error,
        loading,
        speaker,
        setSpeaker,
        participants,
        progress,
        setProgress,
        broadcastProgress,
        elapsedTime,
        setElapsedTime,
        scrollMode,
        setScrollMode,
        containerWidth,
        setContainerWidth,
        speedMultiplier,
        wordsWithTimestamps,
        chaptersWithTimestamps,
        totalDuration,
        isAutoscrollOn,
        setIsAutoscrollOn,
        isSeeking,
        setIsSeeking,
        getController,
        controller,
        setController,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = (): any => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error(
      "usePresentation must be used within a PresentationProvider"
    );
  }
  return context;
};
