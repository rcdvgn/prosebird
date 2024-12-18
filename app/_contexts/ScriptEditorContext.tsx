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

import {
  saveScript,
  subscribeToNodes,
  subscribeToScript,
  getPeople,
} from "../_actions/actions";

import { emptyNode } from "../_utils/emptyNode";
import { useAuth } from "./AuthContext";

const ScriptEditorContext = createContext<any>(undefined);

export const ScriptEditorProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [script, setScript] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedScript, setLastSavedScript] = useState<any>(null);
  const [participants, setParticipants] = useState<any>([]);
  const [lastFetchedParticipants, setLastFetchedParticipants] = useState<any>(
    []
  );

  const hasUnsavedChanges = () => {
    const cond = _.isEqual(
      { ...script.data, lastModified: null },
      { ...lastSavedScript.data, lastModified: null }
    );

    return !cond;
  };

  const addNode = (position: number, user: any) => {
    const newNode: any = {
      ...emptyNode,
      speaker: user.id,
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
        console.log("about to be saved to server");
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

    const applyServerChanges = (serverScript: any) => {
      if (
        !_.isEqual(
          { ...serverScript.data, lastModified: null },
          { ...script.data, lastModified: null }
        )
      ) {
        setScript(serverScript);
        setLastSavedScript(_.cloneDeep(serverScript));
      }
    };

    const unsubscribeScript: any = subscribeToScript(
      script,
      applyServerChanges
    );
    const unsubscribeNodes: any = subscribeToNodes(script, applyServerChanges);

    return () => {
      unsubscribeScript();
      unsubscribeNodes();
    };
  }, [script?.id]);

  useEffect(() => {
    if (!script || !user) return;

    const editors = script.data.editors || [];
    const viewers = script.data.viewers || [];
    const guests = script.data.guests || [];
    const author = script.data.createdBy;

    const combinedParticipants = [...editors, ...viewers, ...guests, author];

    if (!_.isEqual(combinedParticipants, lastFetchedParticipants)) {
      setLastFetchedParticipants(combinedParticipants);

      const fetchParticipants = async () => {
        try {
          // Fix Promise.all destructuring to match number of promises
          const [editorsDocs, viewersDocs, authorDoc]: any = await Promise.all([
            getPeople(editors, []),
            getPeople(viewers, []),
            // user.id !== author ? getPeople([author], []) : Promise.resolve([]),
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

          // Add author to participants if fetched
          const authorWithRole = [{ ...authorDoc[0], role: "author" }];
          // authorDoc.length > 0 ? [{ ...authorDoc[0], role: "author" }] : [];

          // Handle guests
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
        setScript,
        emptyNode,
        addNode,
        deleteNode,
        isSaved,
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
