import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

interface ScriptNode {
  id: string;
  title: string;
  paragraph: string;
  speaker: string;
}

import { saveScript, subscribeToScript } from "../_actions/actions";

export const emptyNode: ScriptNode = {
  id: "",
  title: "New Chapter",
  paragraph: "",
  speaker: "You",
};

const ScriptEditorContext = createContext<any>(undefined);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedScript, setLastSavedScript] = useState<any>(null);

  const hasUnsavedChanges = () => {
    const cond = _.isEqual(script, lastSavedScript);

    return !cond;
  };

  const addNode = (position: number) => {
    const newNode: ScriptNode = {
      ...emptyNode,
      id: uuidv4(),
    };

    let copyScriptData = { ...script.data };
    copyScriptData.nodes.splice(position, 0, newNode);
    setScript({ ...script, data: copyScriptData });
  };

  const deleteNode = (id: string) => {
    let copyScriptData = { ...script.data };
    copyScriptData.nodes = copyScriptData.nodes.filter(
      (node: any) => node.id !== id
    );
    setScript({ ...script, data: copyScriptData });
  };

  useEffect(() => {
    const handleSave = debounce(async () => {
      if (hasUnsavedChanges()) {
        await saveScript(script);
        setLastSavedScript(_.cloneDeep(script));
      }

      setIsSaved(true);
    }, 1000);

    if (script) {
      if (!lastSavedScript) {
        setLastSavedScript(_.cloneDeep(script));
      } else {
        if (isSaved) {
          setIsSaved(false);
        }
        handleSave();
      }
    }

    return () => {
      handleSave.cancel();
    };
  }, [script]);

  useEffect(() => {
    if (!script) return;

    const unsubscribe = subscribeToScript(script.id, (serverScript) => {
      if (!_.isEqual(serverScript, script)) {
        setScript(serverScript);
        setLastSavedScript(_.cloneDeep(serverScript));
      }
    });

    return () => unsubscribe();
  }, [script?.id]);

  return (
    <ScriptEditorContext.Provider
      value={{
        script,
        setScript,
        emptyNode,
        addNode,
        deleteNode,
        isSaved,
      }}
    >
      {children}
    </ScriptEditorContext.Provider>
  );
};

export const useScriptEditor = (): any => {
  const context = useContext(ScriptEditorContext);
  if (!context) {
    throw new Error(
      "useScriptEditor must be used within a ScriptEditorProvider"
    );
  }
  return context;
};
