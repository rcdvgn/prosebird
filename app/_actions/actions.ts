"use client";

import { emptyNode } from "../_contexts/ScriptEditorContext";

import {
  collection,
  setDoc,
  limit,
  onSnapshot,
  updateDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  Timestamp,
  addDoc,
  orderBy,
  documentId,
} from "firebase/firestore";

import { db } from "../_config/fireabase";

export const createScript: any = async (userId: any) => {
  const blankScript = {
    title: "Untitled",
    favorite: false,
    createdBy: userId,
    createdAt: Timestamp.now(),
    lastModified: Timestamp.now(),
    editors: [],
    viewers: [],
    guests: [],
  };

  const blankNodes = [emptyNode]; // Nodes now stored separately

  try {
    const docRef = await addDoc(collection(db, "scripts"), blankScript);
    const docId = docRef.id;

    await setDoc(doc(db, "nodes", docId), { nodes: blankNodes });

    return { data: { ...blankScript, nodes: blankNodes }, id: docId };
  } catch (error) {
    console.error("Error creating script: ", error);
  }
};

export async function getScriptData(fileId: string) {
  try {
    const scriptRef = doc(db, "scripts", fileId);
    const scriptDoc = await getDoc(scriptRef);

    if (!scriptDoc.exists()) {
      console.error(`Script with ID ${fileId} does not exist.`);
      return null;
    }

    const scriptData = scriptDoc.data();

    // Fetch nodes separately from the "nodes" collection
    const nodesRef = doc(db, "nodes", fileId);
    const nodesDoc = await getDoc(nodesRef);
    const nodes = nodesDoc.exists() ? nodesDoc.data().nodes : [];

    // Merge nodes with script data
    return { id: scriptDoc.id, data: { ...scriptData, nodes } };
  } catch (error) {
    console.error("Error fetching script data:", error);
    return null;
  }
}

export async function getUserScripts(userId: string) {
  const q = query(collection(db, "scripts"), where("createdBy", "==", userId));

  const querySnapshot = await getDocs(q);

  const scripts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }));

  return scripts;
}

export const saveScript = async (script: any) => {
  try {
    const docRef = doc(db, "scripts", script.id);

    // Separate nodes from the rest of the script data
    const { nodes, ...scriptData } = script.data;

    // Update the script data without nodes
    const updatedScriptData = {
      ...scriptData,
      lastModified: Timestamp.now(),
    };
    await updateDoc(docRef, updatedScriptData);

    // Update nodes in the separate collection
    const nodesRef = doc(db, "nodes", script.id);
    await updateDoc(nodesRef, { nodes });
  } catch (error) {
    console.error("Error saving script:", error);
  }
};

export const subscribeToScript = (localScript: any, onUpdate: any) => {
  const scriptRef = doc(db, "scripts", localScript.id);

  const unsubscribeScript = onSnapshot(scriptRef, (scriptSnapshot) => {
    if (scriptSnapshot.exists()) {
      const scriptData = scriptSnapshot.data();

      const serverScript = {
        id: localScript.id,
        data: {
          ...scriptData,
          nodes: localScript.data.nodes,
        },
      };

      onUpdate(serverScript);
    }
  });

  return unsubscribeScript;
};

export const subscribeToNodes = (localScript: any, onUpdate: any) => {
  const nodesRef = doc(db, "nodes", localScript.id);

  const unsubscribeNodes = onSnapshot(nodesRef, (nodesSnapshot) => {
    const nodesData = nodesSnapshot.exists()
      ? nodesSnapshot.data().nodes
      : [emptyNode];

    const serverScript = {
      id: localScript.id,
      data: {
        ...localScript.data,
        nodes: nodesData,
      },
    };

    onUpdate(serverScript);
  });
  return unsubscribeNodes;
};

export const subscribeToRecentScripts = (
  userId: string,
  onUpdate: (data: any) => void
) => {
  const scriptsCollection = collection(db, "scripts");

  const q = query(
    scriptsCollection,
    // where("createdBy", "==", userId),
    orderBy("lastModified", "desc"),
    limit(10)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const recentScripts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    onUpdate(recentScripts);
  });

  return unsubscribe;
};

// Adjust the return type to include user objects
export const getScriptPeople = async (
  createdBy: string,
  editors: string[],
  viewers: string[]
): Promise<{ createdBy: any; editors: any; viewers: any }> => {
  try {
    const scriptPeople = {
      createdBy: null as any, // Initially null
      editors: [] as any, // Empty array for editors
      viewers: [] as any, // Empty array for viewers
    };

    // Fetch createdBy user
    const createdByRef = doc(db, "users", createdBy);
    const createdByDoc = await getDoc(createdByRef);
    if (createdByDoc.exists()) {
      scriptPeople.createdBy = {
        id: createdByDoc.id,
        ...createdByDoc.data(),
      };
    }

    // Fetch editors
    if (editors.length > 0) {
      const editorRefs = editors.map((id) => doc(db, "users", id));
      const editorDocs = await Promise.all(
        editorRefs.map((ref) => getDoc(ref))
      );
      scriptPeople.editors = editorDocs
        .filter((doc) => doc.exists())
        .map((doc) => ({
          id: doc.id,
          ...doc.data(), // Include other user fields
        }));
    }

    // Fetch viewers
    if (viewers.length > 0) {
      const viewerRefs = viewers.map((id) => doc(db, "users", id));
      const viewerDocs = await Promise.all(
        viewerRefs.map((ref) => getDoc(ref))
      );
      scriptPeople.viewers = viewerDocs
        .filter((doc) => doc.exists())
        .map((doc) => ({
          id: doc.id,
          ...doc.data(), // Include other user fields
        }));
    }
    return scriptPeople; // Return the structured object
  } catch (error) {
    console.error("Error fetching script people: ", error);
    return { createdBy: null, editors: [], viewers: [] }; // Fallback return
  }
};

export const getPeople = async (userIds: any) => {
  if (userIds.length === 0) {
    return [];
  }

  try {
    const userDocs = await Promise.all(
      userIds.map(async (id: any) => {
        const docRef = doc(db, "users", id); // Assume "users" is the collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.warn(`No document found for ID: ${id}`);
          return null; // or handle missing documents as desired
        }
      })
    );

    return userDocs.filter((doc) => doc !== null) as any;
  } catch (error) {
    console.error("Error fetching user documents:", error);
    throw error;
  }
};

export const addScriptGuest = async (script: any, newGuest: any) => {
  const updatedGuests = [...script.data.guests, newGuest];

  try {
    const docRef = doc(db, "scripts", script.id);

    await updateDoc(docRef, { guests: updatedGuests });
  } catch (error) {
    console.error("Error adding guest", error);
  }
};

export const changeNodeSpeaker = async (
  script: any,
  nodePosition: any,
  newSpeakerId: any
) => {
  const updatedNode = {
    ...script.data.nodes[nodePosition],
    speaker: newSpeakerId,
  };
  let updatedNodes = [...script.data.nodes];
  updatedNodes[nodePosition] = updatedNode;

  try {
    const docRef = doc(db, "nodes", script.id);
    await updateDoc(docRef, { nodes: updatedNodes });
  } catch (error) {
    console.error("Error changing node speaker", error);
  }
};
