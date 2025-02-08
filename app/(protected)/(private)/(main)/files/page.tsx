"use client";

import { motion } from "framer-motion";
import { MoreIcon, PlusIcon, SearchIcon } from "@/app/_assets/icons";
import AllDocuments from "@/app/_components/AllDocuments";
import ProfilePicture from "@/app/_components/ProfilePicture";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";

import { createScript } from "@/app/_services/client";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Settings from "@/app/_components/modals/Settings";
import { useEffect, useRef, useState } from "react";
import OutsideClickHandler from "@/app/_components/utils/OutsideClickHandler";

export default function Files() {
  const { setScript } = useScriptEditor();
  const { openModal } = useModal();
  const { user, logout } = useAuth();

  const profilePictureWrapper = useRef<any>(null);

  const [isUserOptionsVisible, setIsUserOptionsVisible] = useState<any>(false);

  const router = useRouter();

  const handleCreateScript = async () => {
    if (user !== null) {
      const newScript = await createScript(user.id);
      setScript(newScript);
      router.push(`/file/${newScript.id}`);
    }
  };

  const handleCloseProfileOptions = () => {
    setIsUserOptionsVisible(false);
  };

  const handleSettings = () => {
    openModal({ content: <Settings />, name: "settings" });
  };

  const [shouldRender, setShouldRender] = useState(isUserOptionsVisible);

  useEffect(() => {
    if (isUserOptionsVisible) {
      setShouldRender(true);
    }
  }, [isUserOptionsVisible]);

  return (
    <div className="flex flex-col w-full">
      <div className="pr-10 h-[68px] w-full shrink-0 flex items-center justify-between">
        <div className="flex items-center w-[400px] h-11 bg-foreground focus-within:bg-battleground rounded-[10px] px-2.5">
          <span className="p-1">
            <SearchIcon className="text-secondary h-3.5" />
          </span>

          <input type="text" className="!grow input-2" placeholder="Search" />

          <span className="bg-middleground rounded-md font-bold text-secondary text-[11px] py-1 px-2">
            ctrl+k
          </span>
        </div>

        <div className="flex items-center justify-start gap-6">
          <button onClick={handleCreateScript} className="btn-1-md">
            <PlusIcon className="text-primary h-2.5" />
            <span className="">New</span>
          </button>

          <div className="relative">
            <span
              ref={profilePictureWrapper}
              onClick={() => setIsUserOptionsVisible((prev: boolean) => !prev)}
              className="block"
            >
              <ProfilePicture
                profilePictureURL={user?.profilePictureURL}
                className="h-9 cursor-pointer"
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
            </span>

            <OutsideClickHandler
              onOutsideClick={handleCloseProfileOptions}
              exceptionRefs={[profilePictureWrapper]}
              isActive={isUserOptionsVisible}
            >
              <motion.div
                initial={{ opacity: 0, translateY: -4 }}
                animate={{
                  opacity: isUserOptionsVisible ? 1 : 0,
                  translateY: isUserOptionsVisible ? 0 : -4,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onAnimationComplete={() => {
                  if (!isUserOptionsVisible) setShouldRender(false); // Hide AFTER exit animation
                }}
                className={`absolute right-0 top-full mt-4 flex-col gap-1 min-w-44 p-1 bg-foreground rounded-[10px] ring-1 ring-stroke ${
                  shouldRender ? "flex" : "hidden"
                }`}
              >
                {[
                  {
                    text: "Settings",
                    onClick: handleSettings,
                  },
                  {
                    text: "Log out",
                    onClick: logout,
                  },
                  {
                    text: "Get desktop app",
                    onClick: () => console.log("You clicked 'Get desktop app'"),
                  },
                ].map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      onClick={item.onClick}
                      className="px-3 py-2.5 rounded-md hover:bg-hover cursor-pointer font-bold text-[13px] text-inactive hover:text-primary"
                    >
                      {item.text}
                    </div>
                  );
                })}
              </motion.div>
            </OutsideClickHandler>
          </div>
        </div>
      </div>
      <div className="slate">
        <AllDocuments />
      </div>
    </div>
  );
}
