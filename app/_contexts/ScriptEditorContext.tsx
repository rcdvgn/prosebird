"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { Editor } from "@tiptap/react";

import {
  saveScript,
  subscribeToNodes,
  subscribeToScript,
  getPeople,
  saveNodes,
} from "../_services/client";

import { emptyNode } from "../_utils/emptyNode";
import { useAuth } from "./AuthContext";

import { extractChaptersFromDoc } from "../_utils/tiptapHelpers";
import {
  rehydrateEditorContent,
  resetEditorContent,
} from "../_utils/tiptapCommands";
import { fetchParticipants } from "../_utils/fetchParticipants";

interface ScriptEditorContextType {
  script: any;
  nodes: any;
  isSaved: boolean;
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  setScript: (newScriptMetadata: any) => Promise<void>;
  setNodes: (newNodes: any) => Promise<void>;
  emptyNode: any;
  addNode: (
    position: number,
    user: any,
    numberOfChapters: number
  ) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  participants: any[];
}

const ScriptEditorContext = createContext<ScriptEditorContextType | undefined>(
  undefined
);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [script, setScriptState] = useState<any>(null);
  const [nodes, setNodesState] = useState<any>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [debouncedIsSaved, setDebouncedIsSaved] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);

  // Set the debounce delay (in ms)
  const debounceDelay = 500; // adjust this value as needed

  // Create a debounced function that updates debouncedIsSaved
  const debouncedSetTrue = useRef(
    _.debounce(() => {
      setDebouncedIsSaved(true);
    }, debounceDelay)
  ).current;

  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );

  const localScriptUpdate = useRef(false);
  const localNodesUpdate = useRef(false);
  const hasClearedHistory = useRef(false);

  const updateScriptLocal = async (newScriptMetadata: any) => {
    localScriptUpdate.current = true;
    setScriptState(newScriptMetadata);
    setIsSaved(false);
    await saveScript(newScriptMetadata);
    setIsSaved(true);
  };

  const updateNodesLocal = async (newNodes: any) => {
    if (!nodes) return;
    if (_.isEqual(nodes, newNodes)) return;

    localNodesUpdate.current = true;
    setNodesState(newNodes);
    setIsSaved(false);

    if (script?.id) {
      await saveNodes(script.id, newNodes);
    }

    setIsSaved(true);
    setTimeout(() => {
      localNodesUpdate.current = false;
    }, 100);
  };

  const addNode = async (
    position: number,
    user: any,
    numberOfChapters: number
  ) => {
    const newNode: any = {
      title: "Chapter " + (numberOfChapters + 1),
      paragraphs: [[{ text: "" }]],
      speaker: { id: user.id, isGuest: false },
      id: uuidv4(),
    };

    const newNodes = nodes ? [...nodes] : [];
    newNodes.splice(position, 0, newNode);
    await updateNodesLocal(newNodes);

    if (editor) {
      const content = rehydrateEditorContent(newNodes);
      editor.commands.setContent(content);
    }
  };

  const deleteNode = async (id: string) => {
    const newNodes = nodes.filter((node: any) => node.id !== id);
    await updateNodesLocal(newNodes);

    if (editor) {
      const content = rehydrateEditorContent(newNodes);
      editor.commands.setContent(content);
    }
  };

  const handleRehydration = (newNodes: any) => {
    if (editor) {
      const content = rehydrateEditorContent(newNodes);

      if (!hasClearedHistory.current) {
        resetEditorContent(editor, content);
        hasClearedHistory.current = true;
      } else {
        editor.commands.setContent(content);
      }
    }
  };

  // Effect for updating debouncedIsSaved
  useEffect(() => {
    if (isSaved) {
      // When isSaved becomes true, wait for the debounce delay
      debouncedSetTrue();
    } else {
      // When isSaved becomes false, cancel any pending true update and set immediately
      debouncedSetTrue.cancel();
      setDebouncedIsSaved(false);
    }
  }, [isSaved, debouncedSetTrue]);

  // Subscribe to script changes
  useEffect(() => {
    if (!script?.id) return;

    const unsubscribeScript = subscribeToScript(
      script,
      (serverScriptData: any) => {
        if (localScriptUpdate.current) {
          localScriptUpdate.current = false;
          return;
        }
        setScriptState((prev: any) => ({ ...prev, ...serverScriptData }));
      }
    );

    return () => unsubscribeScript();
  }, [script?.id]);

  // Subscribe to nodes changes
  useEffect(() => {
    if (!script?.id) return;

    const unsubscribeNodes = subscribeToNodes(
      script,
      (serverNodesData: any) => {
        setNodesState((prevNodes: any) => {
          if (!_.isEqual(serverNodesData.nodes, prevNodes)) {
            return serverNodesData.nodes;
          }
          return prevNodes;
        });
      }
    );

    return () => unsubscribeNodes();
  }, [script?.id]);

  // Effect for rehydrating editor content when nodes change
  useEffect(() => {
    if (!nodes || !editor) return;

    if (!localNodesUpdate.current) {
      handleRehydration(nodes);
    }
  }, [editor, nodes]);

  // FIXED: Set up listener for editor updates - fixed the event handler type
  useEffect(() => {
    if (!editor || !nodes) return;

    // The correct way to handle editor updates
    const updateHandler = ({ editor }: { editor: Editor }) => {
      if (!nodes) return;
      const docJSON = editor.getJSON();
      const chaptersData = extractChaptersFromDoc(docJSON);

      if (!localNodesUpdate.current) {
        updateNodesLocal(chaptersData);
      }
    };

    // Add the event listener
    editor.on("update", updateHandler);

    // Clean up
    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor, nodes]);

  // Fetch participants
  useEffect(() => {
    if (!script || !user) return;

    const editors = script?.editors || [];
    const viewers = script?.viewers || [];
    const guests = script?.guests || [];
    const author = script?.createdBy;
    const combinedParticipants = [...editors, ...viewers, ...guests, author];

    if (!_.isEqual(combinedParticipants, lastFetchedParticipants)) {
      setLastFetchedParticipants(combinedParticipants);

      (async () => {
        const fetchedParticipants = await fetchParticipants(
          editors,
          viewers,
          author,
          guests
        );

        setParticipants(fetchedParticipants);
      })();
    }
  }, [script, user]);

  return (
    <ScriptEditorContext.Provider
      value={{
        script,
        nodes,
        editor,
        isSaved: debouncedIsSaved,
        setEditor,
        setScript: updateScriptLocal,
        setNodes: updateNodesLocal,
        emptyNode,
        addNode,
        deleteNode,
        participants,
      }}
    >
      {children}
    </ScriptEditorContext.Provider>
  );
};

export const useScriptEditor = (): ScriptEditorContextType => {
  const context = useContext(ScriptEditorContext);
  if (!context) {
    throw new Error(
      "useScriptEditor must be used within a ScriptEditorProvider"
    );
  }
  return context;
};
