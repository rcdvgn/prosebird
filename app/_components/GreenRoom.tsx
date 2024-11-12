import React, { useEffect } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function GreenRoom({
  presentation,
  setspeaker,
}: {
  presentation: any;
  setspeaker: any;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const handleNewGuest = (guestData: any) => {
    setspeaker(guestData);
  };

  useEffect(() => {
    if (!user || !presentation) return;

    if (user.id === presentation?.host.id) {
      handleNewGuest(user);
    }
  }, [user]);

  return (
    <div className="w-[500px] p-[10px] bg-foreground-primary rounded-[10px] border-[1px] border-border">
      {presentation.guests.map((guestObject: any, index: any) => {
        return (
          <div
            key={index}
            className="flex justify-between items-center w-full px-4 py-8 border-red-500 border-[1px]"
          >
            <div className="flex gap-2">
              <span className="">Profile pic</span>
              <span className="">{guestObject.id}</span>
            </div>
            {guestObject.isConnected ? (
              <span className="">Member already connected</span>
            ) : guestObject.isAnnonymous === true ? (
              <button
                onClick={() => handleNewGuest(guestObject)}
                className="btn-1"
              >
                {"Join as " + guestObject.id}
              </button>
            ) : user?.id === guestObject.id ? (
              <button
                onClick={() => handleNewGuest(guestObject)}
                className="btn-1"
              >
                {"Join as " + guestObject.id}
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
