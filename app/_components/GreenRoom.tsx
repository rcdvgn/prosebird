import React, { useEffect } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePresentation } from "../_contexts/PresentationContext";

export default function GreenRoom() {
  const { presentation, setspeaker } = usePresentation();
  const { user } = useAuth();
  const router = useRouter();

  const enterPresentation = (participant: any) => {
    setspeaker(participant);
  };

  useEffect(() => {
    if (!user || !presentation) return;

    if (user.id === presentation?.host.id) {
      enterPresentation(user);
    }
  }, [user]);

  return (
    <div className="w-[500px] p-[10px] bg-foreground-primary rounded-[10px] border-[1px] border-border">
      {presentation &&
        presentation.participants.map((participant: any, index: any) => {
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
                  className="btn-1"
                >
                  {"Join as " + participant.id}
                </button>
              ) : user?.id === participant.id ? (
                <button
                  onClick={() => enterPresentation(participant)}
                  className="btn-1"
                >
                  {"Join as " + participant.id}
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/signin");
                  }}
                  className="btn-1"
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
