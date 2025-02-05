"use client";

import { MoreIcon, PlusIcon, SearchIcon } from "@/app/_assets/icons";
import AllDocuments from "@/app/_components/AllDocuments";
import ProfilePicture from "@/app/_components/ProfilePicture";
import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";

import { createScript } from "@/app/_services/client";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

export default function Files() {
  const { script, setScript } = useScriptEditor();

  const { user } = useAuth();
  const router = useRouter();

  const handleCreateScript = async () => {
    if (user !== null) {
      const newScript = await createScript(user.id);
      setScript(newScript);
      router.push(`/file/${newScript.id}`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-10 h-[68px] w-full shrink-0 flex items-center justify-between">
        <div className="flex items-center w-[350px] h-11 bg-battleground rounded-[10px] px-2.5">
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

          <ProfilePicture
            profilePictureURL={user?.profilePictureURL}
            className="h-9"
          />
        </div>
      </div>
      <div className="slate">
        <AllDocuments />
      </div>
    </div>
  );
}
