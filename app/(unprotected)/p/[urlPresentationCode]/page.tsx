"use client";
import React, { useState, useEffect } from "react";
// import { useAuth } from "@/app/_contexts/AuthContext";

import GreenRoom from "@/app/_components/GreenRoom";
import Presentation from "@/app/_components/Presentation";

import { usePresentation } from "@/app/_contexts/PresentationContext";

export default function Page({
  params,
}: {
  params: { urlPresentationCode: string };
}) {
  const { urlPresentationCode } = params;

  // const { user } = useAuth();
  const { setPresentationCode, loading, speaker, participants } =
    usePresentation();

  // const [pusherChannel, setPusherChannel] = useState<any>(null);

  useEffect(() => {
    if (!urlPresentationCode) return;
    if (!urlPresentationCode.length) return;

    setPresentationCode(urlPresentationCode);
  }, [urlPresentationCode]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (speaker) {
    if (speaker.isConnected) {
      return <Presentation />;
    }
    // else {
    //   console.log(speaker);
    //   console.log(participants);
    // }
  } else {
    console.log("no speaker");
  }

  return <GreenRoom />;
}
