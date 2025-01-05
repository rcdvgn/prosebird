import { emptyNode } from "../_utils/emptyNode";
import { v4 as uuidv4 } from "uuid";

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

import {
  get,
  query as rtdbQuery,
  ref,
  orderByChild,
  onValue,
  off,
  equalTo,
  onDisconnect,
  set,
} from "firebase/database";

import generatePresentationCode from "@/app/_lib/generatePresentationCode";

import { db, rtdb } from "../_config/fireabase";
import { error } from "console";

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

  const blankNodes: any = [
    {
      ...emptyNode,
      speaker: userId,
      id: uuidv4(),
    },
  ];

  try {
    const docRef = await addDoc(collection(db, "scripts"), blankScript);
    const docId = docRef.id;

    await setDoc(doc(db, "nodes", docId), { nodes: blankNodes });

    return { data: { ...blankScript, nodes: blankNodes }, id: docId };
  } catch (error) {
    console.error("Error creating script: ", error);
  }
};

export async function getScriptAndNodes(fileId: string) {
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

export async function getNodes(fileId: string) {
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

export const getRealtimeNodes = (scriptId: any, onUpdate: any) => {
  const nodesRef = doc(db, "nodes", scriptId);

  const unsubscribeNodes = onSnapshot(nodesRef, (nodesSnapshot) => {
    if (nodesSnapshot.exists()) {
      const latestNodes = nodesSnapshot.data().nodes;
      onUpdate(latestNodes);
    } else {
      console.error("Nodes not found using script id: " + scriptId);
    }
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

export const getPeople = async (userIds: any, exceptionIds: any) => {
  if (userIds.length === 0) {
    return [];
  }
  try {
    const userDocs = await Promise.all(
      userIds.map(async (id: any) => {
        // Need to explicitly return null for excluded IDs
        if (exceptionIds.includes(id)) {
          return null;
        }
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        console.warn(`No document found for ID: ${id}`);
        return null;
      })
    );
    return userDocs.filter((doc) => doc !== null);
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

export async function generateUniquePresentationCode() {
  let generatedCode: string;
  let querySnapshot;
  const presentationsRef = collection(db, "presentations");

  do {
    generatedCode = generatePresentationCode();
    const q = query(presentationsRef, where("code", "==", generatedCode));
    querySnapshot = await getDocs(q);
  } while (!querySnapshot.empty);

  return generatedCode;
}

// export const getPresentationByCode = async (presentationCode: string) => {
//   try {
//     const presentationsRef = collection(db, "presentations");
//     const q = query(presentationsRef, where("code", "==", presentationCode));
//     const querySnap = await getDocs(q);

//     if (querySnap.empty) {
//       console.error("Presentation not found");
//       return null;
//     }

//     const doc = querySnap.docs[0];
//     return {
//       id: doc.id,
//       ...doc.data(),
//     };
//   } catch (error) {
//     console.error("Error getting presentation:", error);
//     throw error;
//   }
// };

export const getPresentationByCode = async (presentationCode: string) => {
  try {
    // Create a reference to the presentations node in RTDB
    const presentationsRef = ref(rtdb, "presentations");

    // Query the RTDB for the presentation with the matching code
    const q = rtdbQuery(
      presentationsRef,
      orderByChild("code"),
      equalTo(presentationCode)
    );
    const snapshot = await get(q);

    // Check if the snapshot contains any data
    if (!snapshot.exists()) {
      console.error("Presentation not found");
      return null;
    }

    // Retrieve the first matching presentation
    const [key, data]: any = Object.entries(snapshot.val())[0];
    return {
      id: key, // The unique ID for the presentation in RTDB
      ...data,
    };
  } catch (error) {
    console.error("Error getting presentation:", error);
    throw error;
  }
};

export const changeMemberStatus = async (
  presentationId: any,
  presentationParticipants: any,
  memberId: any,
  newConnectionStatus: any
) => {
  const updatedParticipants = presentationParticipants.map((item: any) => {
    if (item.id === memberId) {
      return { ...item, isConnected: newConnectionStatus };
    } else {
      return item;
    }
  });

  // console.log(presentationParticipants, updatedParticipants);

  try {
    const docRef = doc(db, "presentations", presentationId);

    await updateDoc(docRef, { participants: updatedParticipants });
  } catch (error) {
    console.error("Error updating member connection status:", error);
  }
};

// export const subscribeToPresentation = (presentationId: any, onUpdate: any) => {
//   const presentationRef = doc(db, "presentations", presentationId);

//   const unsubscribePresentation = onSnapshot(
//     presentationRef,
//     (presentationSnapshot) => {
//       if (presentationSnapshot.exists()) {
//         const latestPresentation = {
//           ...presentationSnapshot.data(),
//           id: presentationSnapshot.id,
//         };
//         onUpdate(latestPresentation);
//       } else {
//         console.error("Nodes not found using script id: " + presentationId);
//       }
//     }
//   );
//   return unsubscribePresentation;
// };

export const subscribeToPresentation = (presentationId: any, onUpdate: any) => {
  // Create a reference to the specific presentation in RTDB
  const presentationRef = ref(rtdb, `presentations/${presentationId}`);

  // Attach a listener to the reference
  const unsubscribePresentation = onValue(
    presentationRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const latestPresentation = {
          ...snapshot.val(),
          id: presentationId,
        };
        onUpdate(latestPresentation);
      } else {
        console.error(
          "Node not found using presentation ID: " + presentationId
        );
      }
    },
    (error) => {
      console.error("Error subscribing to presentation:", error);
    }
  );

  // Return a function to unsubscribe
  return () => off(presentationRef, "value", unsubscribePresentation);
};

export const managePresence = (
  presentationId: any,
  user: any,
  onParticipantsChange: any
) => {
  console.log(user);
  const presenceRef = ref(
    rtdb,
    `presentations/${presentationId}/participants/${user.id}`
  );
  const connectedRef = ref(rtdb, ".info/connected");
  const participantsRef = ref(
    rtdb,
    `presentations/${presentationId}/participants`
  );

  // Listener for connection status
  const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
    const isConnected = snapshot.val();
    if (isConnected) {
      // Update the user's connection status in the database
      set(presenceRef, {
        role: user.role,
        isConnected: true,
        // connectedAt: Date.now(),
      }).catch((error) => {
        console.error("Error setting presence:", error);
      });

      // Automatically update the user to disconnected status when they disconnect
      onDisconnect(presenceRef)
        .set({
          role: user.role,
          isConnected: false,
        })
        .catch((error) => {
          console.error("Error setting disconnect status:", error);
        });
    }
  });

  // Listener for participants updates
  const unsubscribeParticipants = onValue(participantsRef, (snapshot) => {
    const participants = snapshot.val() || {};
    onParticipantsChange(participants);
  });

  // Return a cleanup function
  return () => {
    unsubscribeConnected();
    unsubscribeParticipants();
  };
};
