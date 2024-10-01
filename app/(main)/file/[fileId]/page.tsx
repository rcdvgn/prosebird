"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getScriptData } from "@/app/actions/actions";
import { useAuth } from "@/app/contexts/AuthContext";
import ScriptEditor from "@/app/components/ScriptEditor";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function File({ params }: { params: { fileId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const { script, setScript } = useScriptEditor();

  useEffect(() => {
    if (user) {
      const fetchFileData = async () => {
        const newScript = await getScriptData(params.fileId);
        if (!newScript) {
          router.push("/files");
        } else {
          setScript(newScript);
        }
      };
      fetchFileData();
    }
  }, [user, params.fileId, router]);

  if (!script) return <div>Loading...</div>;

  return script && <ScriptEditor />;
}
