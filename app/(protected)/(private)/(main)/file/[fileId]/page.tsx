"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getScriptAndNodes } from "@/app/_actions/actions";
import { useAuth } from "@/app/_contexts/AuthContext";
import ScriptEditor from "@/app/_components/ScriptEditor";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

export default function File({ params }: { params: { fileId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const { script, setScript, participants } = useScriptEditor();

  useEffect(() => {
    if (user) {
      const fetchFileData = async () => {
        const newScript = await getScriptAndNodes(params.fileId);
        if (!newScript) {
          router.push("/files");
        } else {
          setScript(newScript);
        }
      };
      fetchFileData();
    }
  }, [user, params.fileId, router]);

  if (!script || !participants) return <div>Loading...</div>;

  return script && <ScriptEditor />;
}
