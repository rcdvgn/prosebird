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

  // These refs track if a change was initiated locally for each part.
  const localScriptUpdate = useRef(false);
  const localNodesUpdate = useRef(false);

  /**
   * Updates metadata locally and persists the change.
   */
  const updateScriptLocal = async (newScriptMetadata: any) => {
    localScriptUpdate.current = true;
    setScriptState(newScriptMetadata);
    setIsSaved(false);
    await saveScript(newScriptMetadata);
    setIsSaved(true);
  };

  /**
   * Updates nodes locally and persists the change.
   * If skipHistory is false (the default), the current nodes are pushed onto the undo stack
   * and the redo stack is cleared.
   */
  const updateNodesLocal = async (newNodes: any, skipHistory = false) => {
    // If nodes already exist and we're not in an undo/redo action, save current state
    if (nodes && !skipHistory) {
      setUndoStack((prev) => [...prev, nodes]);
      // Clear the redo stack on a new change
      setRedoStack([]);
    }
    localNodesUpdate.current = true;
    setNodesState(newNodes);
    setIsSaved(false);
    if (script?.id) {
      await saveNodes(script.id, newNodes);
    }
    setIsSaved(true);
  };

  /**
   * Helper function for adding a node.
   */
  const addNode = async (
    position: number,
    user: any,
    numberOfChapters: number
  ) => {
    const newNode: any = {
      title: "Chapter " + (numberOfChapters + 1),
      paragraph: "",
      speaker: user.id,
      id: uuidv4(),
    };

    // Create a copy of the current nodes array and insert the new node.
    const newNodes = nodes ? [...nodes] : [];
    newNodes.splice(position, 0, newNode);
    await updateNodesLocal(newNodes);
  };

  /**
   * Helper function for deleting a node.
   */
  const deleteNode = async (id: string) => {
    const newNodes = nodes.filter((node: any) => node.id !== id);
    await updateNodesLocal(newNodes);
  };

  /**
   * Undo the last change.
   */
  const undo = async () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, prev.length - 1));
      // Save current state to redo stack
      setRedoStack((prev) => [...prev, nodes]);
      await updateNodesLocal(previousState, true);
    }
  };

  /**
   * Redo the last undone change.
   */
  const redo = async () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
      // Save current state to undo stack
      setUndoStack((prev) => [...prev, nodes]);
      await updateNodesLocal(nextState, true);
    }
  };

  // Subscribe to metadata changes (Firestore).
  useEffect(() => {
    if (!script?.id) return;
    const unsubscribeScript = subscribeToScript(
      script,
      (serverScriptData: any) => {
        if (localScriptUpdate.current) {
          localScriptUpdate.current = false;
          return;
        }
        setScriptState((prev: any) => ({
          ...prev,
          ...serverScriptData,
        }));
      }
    );
    return () => unsubscribeScript();
  }, [script?.id]);

  // Subscribe to nodes changes (RTDB).
  useEffect(() => {
    if (!script?.id) return;
    const unsubscribeNodes = subscribeToNodes(
      script,
      (serverNodesData: any) => {
        if (!_.isEqual(serverNodesData.nodes, nodes)) {
          console.log("Remote update detected");
          setNodesState(serverNodesData.nodes);
        }
      }
    );
    return () => unsubscribeNodes();
  }, [script?.id]);

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
