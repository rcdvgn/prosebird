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

import {
  saveScript,
  subscribeToNodes,
  subscribeToScript,
  getPeople,
  saveNodes,
} from "../_services/client";

import { emptyNode } from "../_utils/emptyNode";
import { useAuth } from "./AuthContext";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Chapter from "../_components/_tiptap/extensions/Chapter";
import Title from "../_components/_tiptap/extensions/Title";
import Paragraph from "../_components/_tiptap/extensions/Paragraph";
import ChapterDivider from "../_components/_tiptap/extensions/ChapterDivider";
import { useEditor } from "@tiptap/react";
import { extractChaptersFromDoc } from "../_utils/tiptapHelpers";
import { rehydrateEditorContent } from "../_utils/tiptapCommands";

const ScriptEditorContext = createContext<any>(undefined);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // 'script' holds metadata (editors, viewers, createdBy, etc.)
  const [script, setScriptState] = useState<any>(null);
  // 'nodes' holds the document content (the nodes array)
  const [nodes, setNodesState] = useState<any>(null);

  const [isSaved, setIsSaved] = useState<any>(true);
  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );

  // Stacks for undo/redo
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // These refs track if a change was initiated locally.
  const localScriptUpdate = useRef(false);
  const localNodesUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    injectCSS: false,
    extensions: [
      Document,
      Text,
      Paragraph, // Your custom Paragraph node
      Title,
      Chapter,
      ChapterDivider,
    ],
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      // Only update if we already have a nodes state (avoid initial update)
      if (!nodes) return;
      const docJSON = editor.getJSON();
      const chaptersData = extractChaptersFromDoc(docJSON);
      // Only update remote if the change is local (not caused by our remote subscription)
      if (!localNodesUpdate.current) {
        updateNodesLocal(chaptersData);
      }
    },
  });

  /**
   * Updates script metadata locally and persists the change.
   */
  const updateScriptLocal = async (newScriptMetadata: any) => {
    localScriptUpdate.current = true;
    setScriptState(newScriptMetadata);
    setIsSaved(false);
    await saveScript(newScriptMetadata);
    setIsSaved(true);
  };

  /**
   * Updates nodes locally and propagates changes to remote.
   * localNodesUpdate flag is used to prevent a rehydration loop.
   */
  const updateNodesLocal = async (newNodes: any) => {
    if (!nodes) return;
    if (_.isEqual(nodes, newNodes)) return;

    // Mark this update as local.
    localNodesUpdate.current = true;
    setNodesState(newNodes);
    setIsSaved(false);
    if (script?.id) {
      await saveNodes(script.id, newNodes);
    }
    setIsSaved(true);
    // Clear the local update flag after a short delay
    setTimeout(() => {
      localNodesUpdate.current = false;
    }, 100);
  };

  /**
   * Helper for adding a node.
   */
  const addNode = async (
    position: number,
    user: any,
    numberOfChapters: number
  ) => {
    const newNode: any = {
      title: "Chapter " + (numberOfChapters + 1),
      paragraphs: [""],
      speaker: user.id,
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

  /**
   * Helper for deleting a node.
   */
  const deleteNode = async (id: string) => {
    const newNodes = nodes.filter((node: any) => node.id !== id);
    await updateNodesLocal(newNodes);
    if (editor) {
      const content = rehydrateEditorContent(newNodes);
      editor.commands.setContent(content);
    }
  };

  /**
   * Undo/Redo omitted for brevity; implement as needed.
   */
  const undo = async () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, prev.length - 1));
      setRedoStack((prev) => [...prev, nodes]);
      await updateNodesLocal(previousState);
    }
  };

  const redo = async () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
      setUndoStack((prev) => [...prev, nodes]);
      await updateNodesLocal(nextState);
    }
  };

  const handleRehydration = (newNodes: any) => {
    if (editor) {
      const content = rehydrateEditorContent(newNodes);
      editor.commands.setContent(content);
    }
  };

  // Subscribe to script metadata changes.
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

  // Subscribe to nodes changes.
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

  // Rehydrate content when nodes change, if the update is not local.
  useEffect(() => {
    if (!nodes) return;
    if (!localNodesUpdate.current) {
      handleRehydration(nodes);
    }
  }, [nodes]);

  // Participants fetching effect remains unchanged.
  useEffect(() => {
    if (!script || !user) return;
    const editors = script?.editors || [];
    const viewers = script?.viewers || [];
    const guests = script?.guests || [];
    const author = script?.createdBy;
    const combinedParticipants = [...editors, ...viewers, ...guests, author];
    if (!_.isEqual(combinedParticipants, lastFetchedParticipants)) {
      setLastFetchedParticipants(combinedParticipants);
      const fetchParticipants = async () => {
        try {
          const [editorsDocs, viewersDocs, authorDoc]: any = await Promise.all([
            getPeople(editors, []),
            getPeople(viewers, []),
            getPeople([author], []),
          ]);
          const editorsWithRoles = editorsDocs.map((doc: any) => ({
            ...doc,
            role: "editor",
          }));
          const viewersWithRoles = viewersDocs.map((doc: any) => ({
            ...doc,
            role: "viewer",
          }));
          const authorWithRole = [{ ...authorDoc[0], role: "author" }];
          const guestsWithRoles = guests.map((guest: any) => ({
            id: guest,
            role: "guest",
          }));
          setParticipants([
            ...editorsWithRoles,
            ...viewersWithRoles,
            ...authorWithRole,
            ...guestsWithRoles,
          ]);
        } catch (error) {
          console.error("Error fetching participants:", error);
        }
      };
      fetchParticipants();
    }
  }, [script, user]);

  return (
    <ScriptEditorContext.Provider
      value={{
        script,
        nodes,
        editor,
        isSaved,
        setScript: updateScriptLocal,
        setNodes: updateNodesLocal,
        emptyNode,
        addNode,
        deleteNode,
        undo,
        redo,
        undoStack,
        redoStack,
        participants,
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
