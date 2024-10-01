import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { debounce } from "lodash"; // Import lodash or implement your own debounce
import { v4 as uuidv4 } from "uuid";
import _ from "lodash"; // Import lodash

interface ScriptNode {
  id: string;
  title: string;
  paragraph: string;
  speaker: string;
}

import { saveScript } from "../actions/actions";

export const emptyNode: ScriptNode = {
  id: "",
  title: "New Chapter",
  paragraph: "",
  speaker: "You",
};

const ScriptEditorContext = createContext<any>(undefined);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(true); // Tracks if script is saved
  const [lastSavedScript, setLastSavedScript] = useState<any>(null); // Tracks the last saved version

  // Function to check if there are unsaved changes by comparing script states
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
    // setIsSaved(false);
  };

  const deleteNode = (id: string) => {
    let copyScriptData = { ...script.data };
    copyScriptData.nodes = copyScriptData.nodes.filter(
      (node: any) => node.id !== id
    );
    setScript({ ...script, data: copyScriptData });
    // setIsSaved(false);
  };

  useEffect(() => {
    const handleSave = debounce(async () => {
      if (hasUnsavedChanges() && script) {
        console.log(script);
        if (isSaved) {
          setIsSaved(false);
        }
        console.log("Unsaved changes detected, saving...");
        await saveScript(script);
        setLastSavedScript(_.cloneDeep(script)); // Clone the script before saving as lastSavedScript
        setIsSaved(true); // Mark as saved after successful save
        console.log("Script saved.");
      }
    }, 1000); // Save after 1 second of inactivity

    if (script) {
      handleSave();
    }

    return () => {
      handleSave.cancel(); // Cancel pending debounced save on unmount
    };
  }, [script]);

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
