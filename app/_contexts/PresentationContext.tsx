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

import {
  getRealtimeNodes,
  getPeople,
  changeMemberStatus,
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
  const [speaker, setspeaker] = useState<any>(null);

  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );
  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

  const [pusherClient, setPusherClient] = useState<any>(null);

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

  // const getParticipants = () => {
  //   if (presentation) {
  //     setParticipants();
  //   }
  // };

  useEffect(() => {
    if (!presentation) return;

    console.log(presentation);

    const handleNodesChanges = (latestNodes: any) => {
      console.log("Most recent nodes version: " + latestNodes);

      setRealtimeNodes(latestNodes);
    };

    const unsubscribeNodes: any = getRealtimeNodes(
      presentation?.scriptId,
      handleNodesChanges
    );

    // getParticipants();

    return () => {
      unsubscribeNodes();
    };
  }, [presentation]);

  useEffect(() => {
    if (!presentation) return;

    const participantsData = presentation.participants || [];

    if (!_.isEqual(participantsData, lastFetchedParticipants)) {
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
        } catch (error) {
          console.error("Error fetching participant details:", error);
        }
      };

      fetchParticipantDetails();
    }
  }, [presentation]);

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

    setPusherClient(client);

    // Sign in before subscribing to the channel
    // client.signin()
    const channel = client.subscribe(`presence-${presentationCode}`);

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
        setPusherClient(null); // Clear the client instance
      });
    };
  }, [speaker?.id, presentation?.id]);

  // useEffect(() => {
  //   console.log(participants);
  // }, [participants]);

  return (
    <PresentationContext.Provider
      value={{
        presentationCode,
        setPresentationCode,
        presentation,
        error,
        loading,
        speaker,
        setspeaker,
        participants,
        pusherClient,
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
