"use client";
import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { useAuth } from "@/app/_contexts/AuthContext";

import GreenRoom from "@/app/_components/GreenRoom";
import Presentation from "@/app/_components/Presentation";

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

export default function Page({
  params,
}: {
  params: { presentationCode: string };
}) {
  const { presentationCode } = params;
  const { user } = useAuth();

  const [speaker, setspeaker] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [presentation, setPresentation] = useState<any>(null);
  const [pusherChannel, setPusherChannel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validatePresentation = async () => {
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
      members.each((member) => console.log("Member:", member));
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

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return <GreenRoom presentation={presentation} setspeaker={setspeaker} />;

  // return speaker ? (
  //   <Presentation
  //     speaker={speaker}
  //     presentationCode={speaker}
  //     presentation={presentation}
  //     pusherClient={pusherClient}
  //   />
  // ) : (
  //   <GreenRoom presentation={presentation} setspeaker={setspeaker} />
  // );
}
