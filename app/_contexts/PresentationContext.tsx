"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { debounce } from "lodash";
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
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );
  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

  const [pusherChannel, setPusherChannel] = useState<any>(null);

  const containerWidth = 520;
  const speedMultiplier = 1;

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
    console.log(presentationCode);
    if (!presentationCode) return;
    if (!presentationCode.length) return;

    const validatePresentation = async () => {
      console.log("Attempting to validate the presentation");
      try {
        const response = await fetch("/api/presentation/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presentationCode }),
        });

        const data = await response.json();

        if (data.presentation) {
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
          // console.log(scriptWithTimestamps);
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
      console.log("Most recent presentation version: " + latestPresentation);

      setPresentation(latestPresentation);
    };

    const handleNodesChanges: any = (latestNodes: any) => {
      console.log("Most recent nodes version: " + latestNodes);

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
        console.log("Successfully subscribed to channel", members);

        // Set the current speaker's status to connected
        if (speaker.id === members.myID) {
          await handleMemberStatus(speaker.id, true);
        }

        members.each((member: any) => console.log("Member:", member));
      }
    );

    channel.bind("pusher:member_added", (member: any) => {
      console.log("Other member added to channel", member);
    });

    channel.bind("pusher:member_removed", async (member: any) => {
      console.log("Member removed from channel", member);
      await handleMemberStatus(member.id, false);
    });

    return () => {
      // Set the speaker's status to disconnected on cleanup
      handleMemberStatus(speaker.id, false).then(() => {
        client.unsubscribe(`presence-${presentationCode}`);
        client.disconnect();
      });
    };
  }, [speaker?.id, presentation?.id]);

  // update participants and speaker variable in realtime
  useEffect(() => {
    if (!presentation) return;

    const participantsData = presentation.participants || [];

    if (!_.isEqual(participantsData, lastFetchedParticipants)) {
      console.log("Change in participants, proceeding to fetch individually");
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

          if (speaker) {
            if (newParticipantsIds.includes(speaker.id)) {
              const matchedSpeaker = enrichedParticipants.find(
                (participant: any) => participant.id === speaker.id
              );
              setSpeaker(matchedSpeaker || null);
            } else {
              setSpeaker(null);
            }
          }
        } catch (error) {
          console.error("Error fetching participant details:", error);
        }
      };

      fetchParticipantDetails();
    } else {
      console.log("No change in participants");
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

    setProgress(newProgress);
  }, [elapsedTime]);

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
