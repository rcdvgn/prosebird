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

import { getRealtimeNodes } from "../_actions/actions";

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

  const [realtimeNodes, setRealtimeNodes] = useState<any>(null);
  const [newerNodesAvailable, setNewerNodesAvailable] = useState<any>(false);

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

  useEffect(() => {
    console.log("presentation is: " + presentation);
    if (!presentation) return;

    const handleNodesChanges = (latestNodes: any) => {
      console.log("Most recent nodes version: " + latestNodes);

      setRealtimeNodes(latestNodes);
    };

    const unsubscribeNodes: any = getRealtimeNodes(
      presentation?.scriptId,
      handleNodesChanges
    );

    return unsubscribeNodes();
  }, [presentation]);

  useEffect(() => {
    if (!presentation || !speaker) return;

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
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

    // Sign in the user and handle success/error events
    pusherClient.signin();

    const channel = pusherClient.subscribe(`presence-${presentationCode}`);

    // Bind to success and error events for user authentication
    channel.bind("pusher:subscription_succeeded", (members: PusherMembers) => {
      console.log("Successfully subscribed to channel", members);
      members.each((member: any) => console.log("Member:", member));
    });

    channel.bind("pusher:member_added", (member: PusherMember) => {
      console.log("Member added to channel", member);
    });

    channel.bind("pusher:member_removed", (member: PusherMember) => {
      console.log("Member removed from channel", member);
    });

    return () => {
      pusherClient.unsubscribe(`presence-${presentationCode}`);
    };
  }, [speaker, presentation]);

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
