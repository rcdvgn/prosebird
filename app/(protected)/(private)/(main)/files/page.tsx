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
import OutsideClickHandler from "@/app/_components/wrappers/OutsideClickHandler";
import DropdownWrapper from "@/app/_components/wrappers/DropdownWrapper";

export default function Files() {
  const { setScript, setNodes } = useScriptEditor();
  const { openModal } = useModal();
  const { user, logout } = useAuth();

  const router = useRouter();

  const handleCreateScript = async () => {
    if (user !== null) {
      const { nodes: newNodes, ...newScript } = await createScript(user.id);
      setScript(newScript);
      setNodes(newNodes);

      router.push(`/file/${newScript.id}`);
    }
  };

  const handleSettings = () => {
    openModal({ content: <Settings />, name: "settings" });
  };

  // const [shouldRender, setShouldRender] = useState(isUserOptionsVisible);

  const handleOptionClick = (option: any) => {
    console.log(option);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="pr-10 h-16 w-full shrink-0 flex items-center justify-between">
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

          <DropdownWrapper
            align="right"
            optionGroups={[
              [
                { text: "Settings", onClick: handleSettings },
                { text: "Log out", onClick: logout },
                {
                  text: "Get desktop app",
                  onClick: () => console.log("You clicked 'Get desktop app'"),
                },
              ],
            ]}
          >
            <ProfilePicture
              profilePictureURL={user?.profilePictureURL}
              className="h-9 cursor-pointer"
              displayName={user?.displayName}
            />
          </DropdownWrapper>
        </div>
      </div>
      <div className="slate flex flex-col grow overflow-y-auto min-w-0 mr-2 mb-2">
        <AllDocuments />
      </div>
    </div>
  );
}
