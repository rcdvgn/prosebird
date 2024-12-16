"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import Pusher from "pusher-js";
import calculateTimestamps from "@/app/_lib/addTimestamps";

import getPositionFromTimestamp from "../_utils/getPositionFromTimestamp";

import {
  getRealtimeNodes,
  getPeople,
  changeMemberStatus,
  subscribeToPresentation,
} from "../_actions/actions";

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
  const [totalDuration, setTotalDuration] = useState<any>(null);
  const [progress, setProgress] = useState<any>({ line: 0, index: 0 });
  const [participants, setParticipants] = useState<any>([]);
  const [isAutoscrollOn, setIsAutoscrollOn] = useState<boolean>(true);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );
  const [controller, setController] = useState<any>(null);
  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

  const [pusherChannel, setPusherChannel] = useState<any>(null);

  const containerWidth = 520;
  const speedMultiplier = 1;

  const getCurrentChapterSpeaker = (currentLineIndex: any) => {
    if (!presentation || !speaker) return;
    const chapters = presentation?.nodes?.chapters;

    const chapterStartLines = Object.keys(chapters);

    let correctLineSpeaker: any;

    for (let i = chapterStartLines.length - 1; i >= 0; i--) {
      if (chapterStartLines[i] <= currentLineIndex) {
        correctLineSpeaker = chapters[chapterStartLines[i]].speaker;
        break;
      }
    }

    if (correctLineSpeaker !== speaker?.id) {
      setController((previousController: any) => {
        return {
          current: correctLineSpeaker,
          previous: previousController?.previous
            ? previousController?.previous
            : null,
        };
      });
      return false;
    }
    return true;
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
            presentationCode: presentationCode,
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
    // console.log(presentationCode);
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
          const { scriptWithTimestamps, totalDuration } =
            await calculateTimestamps(
              presentation.nodes.words,
              presentation.nodes.chapters,
              containerWidth,
              speedMultiplier
            );

          setTotalDuration(totalDuration);
          setWordsWithTimestamps(scriptWithTimestamps);
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

  // handle pusher authentication and authorization
  useEffect(() => {
    if (!presentation || !speaker) return;

    const handleMemberStatus = async (
      memberId: string,
      isConnected: boolean
    ) => {
      // console.log(memberId, isConnected);

      await changeMemberStatus(
        presentation.id,
        presentation.participants,
        memberId,
        isConnected
      );
    };

    const client: any = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      userAuthentication: {
        endpoint: "/api/pusher/user-auth",
        transport: "ajax",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Changed this
          "X-User-ID": speaker?.id,
        },
        params: {
          uid: speaker?.id,
        },
      },
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Changed this
          "X-User-ID": speaker?.id,
        },
        params: {
          uid: speaker?.id,
        },
      },
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Sign in before subscribing to the channel
    // client.signin()
    const channel = client.subscribe(`presence-${presentationCode}`);
    setPusherChannel(channel);

    channel.bind(
      "pusher:subscription_succeeded",
      async (members: PusherMembers) => {
        // console.log("Successfully subscribed to channel", members);
        // if (speaker.id === members.myID) {
        //   await handleMemberStatus(speaker.id, true);
        // }
        // members.each((member: any) => console.log("Member:", member));
      }
    );

    channel.bind("pusher:member_added", (member: any) => {
      // console.log("Other member added to channel", member);
    });

    channel.bind("pusher:member_removed", async (member: any) => {
      // console.log("Member removed from channel", member);
      // await handleMemberStatus(member.id, false)
    });

    return () => {
      // Set the speaker's status to disconnected on cleanup
      // handleMemberStatus(speaker.id, false).then(() => {
      //   client.unsubscribe(`presence-${presentationCode}`);
      //   client.disconnect();
      // });
    };
  }, [speaker?.id, presentation?.id]);

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
          const newParticipantsIds = participantsData.map(
            (participant: any) => participant.id
          );
          const userDocs = await getPeople(newParticipantsIds, []);

          const userDetailsMap = userDocs.reduce((acc, userDoc) => {
            acc[userDoc.id] = userDoc;
            return acc;
          }, {} as Record<string, any>);

          const enrichedParticipants = participantsData.map(
            (participant: any) => {
              const userDetails = userDetailsMap[participant.id];
              if (userDetails) {
                return {
                  ...userDetails,
                  ...participant,
                };
              }
              return participant;
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

    // console.log(newProgress, progress);

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
        pusherChannel,
        progress,
        setProgress,
        broadcastProgress,
        elapsedTime,
        setElapsedTime,
        scrollMode,
        setScrollMode,
        containerWidth,
        speedMultiplier,
        wordsWithTimestamps,
        totalDuration,
        isAutoscrollOn,
        setIsAutoscrollOn,
        isSeeking,
        setIsSeeking,
        getCurrentChapterSpeaker,
        controller,
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
