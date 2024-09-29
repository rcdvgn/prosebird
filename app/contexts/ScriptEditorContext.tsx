import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define the structure of a script node
interface ScriptNode {
  title: string;
  paragraph: string;
  speaker: string;
}

// Define the empty node structure

// Define the type for the context value (script nodes, their setter, and emptyNode)
interface ScriptEditorContextType {
  scriptNodes: ScriptNode[];
  setScriptNodes: React.Dispatch<React.SetStateAction<ScriptNode[]>>;
  emptyNode: ScriptNode;
  addNode: (position: number) => void; // Add the addNode function
}

// Create the context with a default value
const ScriptEditorContext = createContext<ScriptEditorContextType | undefined>(
  undefined
);

// Create a provider component
export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const emptyNode: ScriptNode = {
    title: "New Chapter",
    paragraph: "",
    speaker: "You",
  };

  const [scriptNodes, setScriptNodes] = useState<ScriptNode[]>([emptyNode]);

  const addNode = (position: number) => {
    console.log(position);
    let copyScriptNodes = [...scriptNodes];
    copyScriptNodes.splice(position, 0, emptyNode);
    setScriptNodes(copyScriptNodes);
  };

  useEffect(() => {
    console.log("scriptNodes: ", scriptNodes);
  }, [scriptNodes]);

  return (
    <ScriptEditorContext.Provider
      value={{ scriptNodes, setScriptNodes, emptyNode, addNode }} // Pass addNode here
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
