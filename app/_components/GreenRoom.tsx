import React, { useEffect } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePresentation } from "../_contexts/PresentationContext";

export default function GreenRoom() {
  const { setspeaker, participants, speaker } = usePresentation();
  const { user } = useAuth();
  const router = useRouter();

  const enterPresentation = (participant: any) => {
    setspeaker(participant);
  };

  useEffect(() => {
    if (!user || !participants.length) return;

    const presentationHost = participants.find((p: any) => p.role === "author");

    if (user.id === presentationHost.id) {
      speaker?.id !== user.id ? enterPresentation(presentationHost) : "";
    }
  }, [user, participants]);

  return (
    <div className="w-[500px] p-[10px] bg-foreground-primary rounded-[10px] border-[1px] border-border">
      {participants &&
        participants.map((participant: any, index: any) => {
          return (
            <div
              key={index}
              className="flex justify-between items-center w-full px-4 py-8 border-red-500 border-[1px]"
            >
              <div className="flex gap-2">
                <span className="">Profile pic</span>
                <span className="">{participant.id}</span>
              </div>
              {participant.isConnected ? (
                <span className="">Member already connected</span>
              ) : participant.role === "guest" ? (
                <button
                  onClick={() => enterPresentation(participant)}
                  className="btn-1-md"
                >
                  Join
                </button>
              ) : user?.id === participant.id ? (
                <button
                  onClick={() => enterPresentation(participant)}
                  className="btn-1-md"
                >
                  Join
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/signin");
                  }}
                  className="btn-1-md"
                >
                  Log-in
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
}
