"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import _, { isEqual } from "lodash";

import getPositionFromTimestamp from "../_utils/getPositionFromTimestamp";

import {
  getRealtimeNodes,
  getPeople,
  subscribeToPresentation,
  managePresence,
} from "../_services/client";
import { generateTimestamps } from "../_lib/addTimestamps";

const PresentationContext = createContext<any>(undefined);

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const [presentationCode, setPresentationCode] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState<any>(null);
  const [scrollMode, setScrollMode] = useState<any>("continuous");
  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );
  const [timestamps, setTimestamps] = useState<any>([]);
  const [isMuted, setIsMuted] = useState<any>(true);
  const [controller, setController] = useState<any>(null);
  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

  // — Fetch & validate presentation (unchanged) …
  const [presentation, setPresentation] = useState<any>(null);
  // … your pusher/presence/subscription logic remains exactly as before :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1} …

  // **New timing state**
  const [flatWords, setFlatWords] = useState<any>([]);
  const [chaptersWithTimestamps, setChaptersWithTimestamps] = useState<any>([]);

  const [totalDuration, setTotalDuration] = useState<number>(0);

  // **Playback / scroll state**
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0); // now a single index into flatWords
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAutoscrollOn, setIsAutoscrollOn] = useState(true);
  const prevNodesRef = useRef();

  // **Layout & speed**
  const [containerWidth, setContainerWidth] = useState(550);
  const speedMultiplier = 1;
  const fontSize = "36";

  const getController = () => {
    // If you have chapters as a flat, sorted array:
    const chapters = chaptersWithTimestamps; // or whatever your flat array is called

    // Find the current chapter for the current progress (flat word index)
    // Assume chapters are sorted by startPosition ascending
    let correctSpeaker = null;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (progress >= chapters[i].startPosition) {
        correctSpeaker = chapters[i].speaker?.id ?? chapters[i].speaker; // support both obj or id
        break;
      }
    }

    if (!controller || correctSpeaker !== controller.current) {
      setController((previousController: any) => ({
        current: correctSpeaker,
        previous: previousController?.current ?? null,
      }));
    }
  };

  const broadcastProgress = async ({
    newPosition,
  }: {
    newPosition: number;
  }) => {
    try {
      await fetch(`/api/presentation/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentationId: presentation.id,
          currentPosition: newPosition,
          userId: speaker.id,
        }),
      });
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

  // Generate timestamps when presentation (or speed) changes
  useEffect(() => {
    // Initial guard
    if (!presentation || !presentation.nodes) {
      return;
    }
    if (isEqual(prevNodesRef.current, presentation.nodes)) {
      return;
    }

    const {
      flatWords: fw,
      chaptersWithTimestamps: ct,
      totalDuration: td,
    } = generateTimestamps(
      presentation.nodes.words,
      presentation.nodes.chapters,
      500 // Your original fixed value
    );

    setFlatWords(fw);
    setChaptersWithTimestamps(ct);
    setTotalDuration(td);

    // Update refs with the current values for the next comparison
    prevNodesRef.current = presentation.nodes;
  }, [presentation?.nodes, speedMultiplier]);

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

  useEffect(() => {
    if (isSeeking || flatWords.length === 0) return;
    const idx = getPositionFromTimestamp(timestamps, elapsedTime);

    if (idx !== progress) {
      setProgress(idx);

      if (speaker.id === controller?.current) {
        broadcastProgress({ newPosition: idx });
      }
    }
  }, [elapsedTime, isSeeking, flatWords, progress, speaker?.id]);

  useEffect(() => {
    if (!presentation || !speaker || !chaptersWithTimestamps.length)
      getController();
  }, [progress, presentation?.code, speaker, chaptersWithTimestamps]);

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
        chaptersWithTimestamps,
        totalDuration,
        isAutoscrollOn,
        setIsAutoscrollOn,
        isSeeking,
        setIsSeeking,
        getController,
        controller,
        setController,
        flatWords,
        setFlatWords,
        timestamps,
        setTimestamps,
        isMuted,
        setIsMuted,
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
