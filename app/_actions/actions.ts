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
  };

  const blankNodes = [emptyNode]; // Nodes now stored separately

  try {
    // Create the script document without the nodes field
    const docRef = await addDoc(collection(db, "scripts"), blankScript);
    const docId = docRef.id;

    // Create the corresponding nodes document in the "nodes" collection
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

    console.log(`Script ${script.id} and nodes updated successfully.`);
  } catch (error) {
    console.error("Error saving script:", error);
  }
};

export const subscribeToScript = (
  scriptId: string,
  onUpdate: (data: any) => void
) => {
  const scriptRef = doc(db, "scripts", scriptId);
  const nodesRef = doc(db, "nodes", scriptId);

  const unsubscribeScript = onSnapshot(scriptRef, (scriptSnapshot) => {
    if (scriptSnapshot.exists()) {
      const scriptData = scriptSnapshot.data();

      // Now listen to the nodes document for changes
      const unsubscribeNodes = onSnapshot(nodesRef, (nodesSnapshot) => {
        const nodesData = nodesSnapshot.exists()
          ? nodesSnapshot.data().nodes
          : [];

        // Combine the script data with nodes data and trigger the update
        onUpdate({
          id: scriptId,
          data: {
            ...scriptData,
            nodes: nodesData,
          },
        });
      });

      // Combine both unsubscribe functions
      return () => {
        unsubscribeScript();
        unsubscribeNodes();
      };
    } else {
      // Handle script not existing
    }
  });

  return unsubscribeScript;
};

export const subscribeToRecentScripts = (onUpdate: (data: any) => void) => {
  const scriptsCollection = collection(db, "scripts");

  const q = query(
    scriptsCollection,
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
    // console.log(scriptPeople);
    return scriptPeople; // Return the structured object
  } catch (error) {
    console.error("Error fetching script people: ", error);
    return { createdBy: null, editors: [], viewers: [] }; // Fallback return
  }
};
