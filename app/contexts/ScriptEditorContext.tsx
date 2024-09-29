import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Define the structure of a script node
interface ScriptNode {
  id: string;
  title: string;
  paragraph: string;
  speaker: string;
}

// Define the empty node structure
const emptyNode: ScriptNode = {
  id: "",
  title: "New Chapter",
  paragraph: "",
  speaker: "You",
};

// Define the structure of the script nodes state
interface ScriptNodesState {
  title: string;
  nodes: ScriptNode[];
}

// Define the type for the context value (script nodes, their setter, and emptyNode)
interface ScriptEditorContextType {
  scriptNodes: ScriptNodesState;
  setScriptNodes: React.Dispatch<React.SetStateAction<ScriptNodesState>>;
  emptyNode: ScriptNode;
  addNode: (position: number) => void;
  deleteNode: (id: string) => void;
}

// Create the context with a default value
const ScriptEditorContext = createContext<ScriptEditorContextType | undefined>(
  undefined
);

// Create a provider component
export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const [scriptNodes, setScriptNodes] = useState<ScriptNodesState>({
    title: "New Script",
    nodes: [emptyNode],
  });

  const addNode = (position: number) => {
    const newNode: ScriptNode = {
      ...emptyNode,
      id: uuidv4(),
    };

    let copyScriptNodes = { ...scriptNodes };
    copyScriptNodes.nodes.splice(position, 0, newNode);
    setScriptNodes(copyScriptNodes);
    console.log("Node added at position: " + position);
  };

  const deleteNode = (id: string) => {
    let copyScriptNodes = { ...scriptNodes };
    copyScriptNodes.nodes = copyScriptNodes.nodes.filter(
      (node) => node.id !== id
    );
    setScriptNodes(copyScriptNodes);
    console.log("Node deleted with id: " + id);
  };

  useEffect(() => {
    console.log("scriptNodes: ", scriptNodes);
  }, [scriptNodes]);

  return (
    <ScriptEditorContext.Provider
      value={{ scriptNodes, setScriptNodes, emptyNode, addNode, deleteNode }}
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
