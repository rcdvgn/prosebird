"use client";

import { emptyNode } from "../contexts/ScriptEditorContext";

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

import { db } from "../config/fireabase";

export const createScript: any = async (userId: any) => {
  const blankScript = {
    title: "Untitled",
    nodes: [emptyNode],
    favorite: false,
    createdBy: userId,
    createdAt: Timestamp.now(),
    lastModified: Timestamp.now(),
    editors: ["111", "222", userId],
    viewers: ["333", "444"],
  };

  try {
    const docRef = await addDoc(collection(db, "scripts"), blankScript);
    const docId = docRef.id;
    return { data: blankScript, id: docId };
  } catch (error) {
    console.error("Error creating script: ", error);
  }
};

export async function getScriptData(fileId: string) {
  try {
    const docRef = doc(db, "scripts", fileId);
    const script = await getDoc(docRef);

    return { id: script.id, data: script.data() };
  } catch (error) {
    console.error("Error fetching script: ", error);
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

    // Only update necessary fields to avoid overwriting the entire document
    const scriptData = {
      ...script.data,
      lastModified: Timestamp.now(),
    };

    await updateDoc(docRef, scriptData);
    // console.log(`Script ${script.id} saved successfully.`);
  } catch (error) {
    console.error("Error saving script:", error);
  }
};

export const subscribeToScript = (
  scriptId: string,
  onUpdate: (data: any) => void
) => {
  const docRef = doc(db, "scripts", scriptId);

  const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const serverScript = docSnapshot.data();
      onUpdate({ id: scriptId, data: serverScript });
    } else {
      // handle script deleted
    }
  });

  return unsubscribe;
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
    console.log(scriptPeople);
    return scriptPeople; // Return the structured object
  } catch (error) {
    console.error("Error fetching script people: ", error);
    return { createdBy: null, editors: [], viewers: [] }; // Fallback return
  }
};
