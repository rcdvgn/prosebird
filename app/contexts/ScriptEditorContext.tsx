import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface ScriptNode {
  id: string;
  title: string;
  paragraph: string;
  speaker: string;
}

const emptyNode: ScriptNode = {
  id: "",
  title: "New Chapter",
  paragraph: "",
  speaker: "You",
};

interface scriptDataState {
  title: string;
  nodes: ScriptNode[];
  favorite: boolean;
  createdBy: string;
  editors: string[];
  viewers: string[];
}

interface ScriptEditorContextType {
  scriptData: scriptDataState;
  setScriptData: React.Dispatch<React.SetStateAction<scriptDataState>>;
  emptyNode: ScriptNode;
  addNode: (position: number) => void;
  deleteNode: (id: string) => void;
}

const ScriptEditorContext = createContext<ScriptEditorContextType | undefined>(
  undefined
);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const user = {
    id: "fxkFMi4yUTgT9HgeG9YF",
    firstName: "Ricardo",
    lastName: "Vigliano",
    email: "ricardorpvigliano@gmail.com",
    createdAt: "idk",
  };

  const [scriptData, setScriptData] = useState<scriptDataState>({
    title: "New Script",
    nodes: [emptyNode],
    favorite: false,
    createdBy: user.id,
    editors: ["111", "222", user.id],
    viewers: ["333", "444"],
  });

  const addNode = (position: number) => {
    const newNode: ScriptNode = {
      ...emptyNode,
      id: uuidv4(),
    };

    let copyScriptData = { ...scriptData };
    copyScriptData.nodes.splice(position, 0, newNode);
    setScriptData(copyScriptData);
    console.log("Node added at position: " + position);
  };

  const deleteNode = (id: string) => {
    let copyScriptData = { ...scriptData };
    copyScriptData.nodes = copyScriptData.nodes.filter(
      (node) => node.id !== id
    );
    setScriptData(copyScriptData);
    console.log("Node deleted with id: " + id);
  };

  useEffect(() => {
    console.log("scriptData: ", scriptData);
  }, [scriptData]);

  return (
    <ScriptEditorContext.Provider
      value={{ scriptData, setScriptData, emptyNode, addNode, deleteNode }}
    >
      {children}
    </ScriptEditorContext.Provider>
  );
};

// Custom hook for accessing the context
export const useScriptEditor = (): ScriptEditorContextType => {
  const context = useContext(ScriptEditorContext);
  if (!context) {
    throw new Error(
      "useScriptEditor must be used within a ScriptEditorProvider"
    );
  }
  return context;
};
