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

import History from "@tiptap/extension-history";
import { emptyNode } from "../_utils/emptyNode";
import { useAuth } from "./AuthContext";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";

import Chapter from "../_components/_tiptap/extensions/Chapter";
import Title from "../_components/_tiptap/extensions/Title";
import Paragraph from "../_components/_tiptap/extensions/Paragraph";
import ChapterDivider from "../_components/_tiptap/extensions/ChapterDivider";
import { useEditor } from "@tiptap/react";
import { extractChaptersFromDoc } from "../_utils/tiptapHelpers";
import {
  rehydrateEditorContent,
  resetEditorContent,
} from "../_utils/tiptapCommands";
import { fetchParticipants } from "../_utils/fetchParticipants";
import { Comment } from "@/app/_components/_tiptap/extensions/CommentMark";

const ScriptEditorContext = createContext<any>(undefined);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [script, setScriptState] = useState<any>(null);
  const [nodes, setNodesState] = useState<any>(null);

  const [isSaved, setIsSaved] = useState<any>(true);
  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );

  const localScriptUpdate = useRef(false);
  const localNodesUpdate = useRef(false);
  const hasClearedHistory = useRef(false);

  const CustomHistory = History.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-z": () => this.editor.commands.undo(),
        "Mod-y": () => this.editor.commands.redo(),
      };
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    injectCSS: false,
    extensions: [
      Document,
      Text,
      Paragraph,
      Title,
      Chapter,
      ChapterDivider,
      CustomHistory,
      Comment,
      Bold,
      Italic,
    ],
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      if (!nodes) return;
      const docJSON = editor.getJSON();
      const chaptersData = extractChaptersFromDoc(docJSON);
      if (!localNodesUpdate.current) {
        updateNodesLocal(chaptersData);
      }
    },
  });

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
        // For subsequent updates, simply set the content.
        editor.commands.setContent(content);
      }
    }
  };

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

  useEffect(() => {
    if (!nodes) return;
    if (!localNodesUpdate.current) {
      handleRehydration(nodes);
    }
  }, [editor, nodes]);

  useEffect(() => {
    if (!script || !user) return;
    const editors = script?.editors || [];
    const viewers = script?.viewers || [];
    const guests = script?.guests || [];
    const author = script?.createdBy;
    const combinedParticipants = [...editors, ...viewers, ...guests, author];
    if (!_.isEqual(combinedParticipants, lastFetchedParticipants)) {
      setLastFetchedParticipants(combinedParticipants);

      const fecthedParticipants = fetchParticipants(
        editors,
        viewers,
        author,
        guests
      );

      setParticipants(fecthedParticipants);
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
