"use client";
import React, { useState, useEffect } from "react";
// import { useAuth } from "@/app/_contexts/AuthContext";

import GreenRoom from "@/app/_components/GreenRoom";
import Presentation from "@/app/_components/Presentation";

import { usePresentation } from "@/app/_contexts/PresentationContext";
import { LoadingIcon } from "@/app/_assets/icons";

export default function Page({
  params,
}: {
  params: { urlPresentationCode: string };
}) {
  const { urlPresentationCode } = params;

  const { setPresentationCode, loading, speaker } = usePresentation();

  useEffect(() => {
    if (!urlPresentationCode) return;
    if (!urlPresentationCode.length) return;

    setPresentationCode(urlPresentationCode);
  }, [urlPresentationCode]);

  if (loading) {
    return (
      <div className="h-full w-full grid place-items-center">
        <LoadingIcon className="text-placeholder h-8 animate-spin" />
      </div>
    );
  }

  if (speaker) {
    if (speaker.isConnected) {
      return <Presentation />;
    }
  }

  return <GreenRoom />;
}
