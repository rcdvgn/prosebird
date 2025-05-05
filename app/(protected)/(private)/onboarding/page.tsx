"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import SplitView from "@/app/_components/SplitView";
import UseCases from "@/app/_components/onboarding/UseCases";
import Activities from "@/app/_components/onboarding/Activities";

export default function Onboarding() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.firstName) {
        router.push("/files");
      }
    } else {
      router.push("/");
    }
  }, [user]);

  return user && !user.firstName ? (
    <SplitView options={{ side: "left", containerWidth: "fit" }}>
      {/* <UseCases /> */}
      <Activities />
    </SplitView>
  ) : null;
}
