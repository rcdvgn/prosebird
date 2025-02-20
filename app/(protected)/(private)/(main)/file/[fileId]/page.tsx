"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getScriptAndNodes } from "@/app/_services/client";
import { useAuth } from "@/app/_contexts/AuthContext";
import ScriptEditor from "@/app/_components/ScriptEditor";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { LoadingIcon } from "@/app/_assets/icons";

export default function File({ params }: { params: { fileId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const { script, setScript, setNodes, participants } = useScriptEditor();

  useEffect(() => {
    if (user) {
      const fetchFileData = async () => {
        const { nodes: newNodes, ...newScript }: any = await getScriptAndNodes(
          params.fileId
        );
        if (!newScript) {
          router.push("/files");
        } else {
          setScript(newScript);
          setNodes(newNodes);
        }
      };
      fetchFileData();
    }
  }, [user, params.fileId, router]);

  if (!script || !participants) {
    return (
      <div className="h-full w-full grid place-items-center">
        <LoadingIcon className="text-placeholder h-8 animate-spin" />
      </div>
    );
  }

  return script && <ScriptEditor />;
}
