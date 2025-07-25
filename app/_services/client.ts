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
  serverTimestamp,
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
  child,
  update,
} from "firebase/database";

import { db, rtdb } from "../_config/firebase/client";
import defaultPreferences from "../_lib/defaultPreferences";
import { gracePeriod } from "../_lib/gracePeriod";

export const fetchUser = async (userId: any) => {
  const userDocRef = doc(db, "users", userId);
  const updatedDoc = await getDoc(userDocRef);

  return { id: userId, ...updatedDoc.data() };
};

// rtdb nodes compliant
export const createScript: any = async (userId: any) => {
  const blankScript = {
    title: "Untitled",
    createdBy: userId,
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
    isFavorite: false,
    editors: [],
    viewers: [],
    guests: [],
  };

  const blankNodes: any = [
    {
      title: "Chapter 1",
      // paragraphs: [""],
      paragraphs: [
        [
          {
            text: "",
          },
        ],
      ],
      speaker: userId,
      id: uuidv4(),
    },
  ];

  try {
    const docRef = await addDoc(collection(db, "scripts"), blankScript);
    const docId = docRef.id;
    console.log("docId: ", docId);

    // Store nodes in Realtime Database
    await set(ref(rtdb, `nodes/${docId}`), blankNodes);

    return { ...blankScript, nodes: blankNodes, id: docId };
  } catch (error) {
    console.error("Error creating script: ", error);
  }
};

// rtdb nodes compliant
export async function getScriptAndNodes(fileId: string) {
  try {
    const scriptRef = doc(db, "scripts", fileId);
    const scriptDoc = await getDoc(scriptRef);

    if (!scriptDoc.exists()) {
      console.error(`Script with ID ${fileId} does not exist.`);
      return null;
    }

    const scriptData = scriptDoc.data();

    const nodes = await getNodes(fileId);

    return { id: scriptDoc.id, ...scriptData, nodes };
  } catch (error) {
    console.error("Error fetching script data:", error);
    return null;
  }
}

// rtdb nodes compliant
export async function getNodes(scriptId: string) {
  try {
    const nodesRef = ref(rtdb, `nodes/${scriptId}`);
    const snapshot = await get(nodesRef);

    return snapshot.exists() ? snapshot.val() : [emptyNode];
  } catch (error) {
    console.error("Error fetching script nodes:", error);
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

// rtdb nodes compliant
export const saveScript = async (script: any) => {
  try {
    const docRef = doc(db, "scripts", script.id);

    const { nodes, ...scriptData } = script;
    const updatedScriptData = {
      ...scriptData,
      lastModified: serverTimestamp(),
    };
    await updateDoc(docRef, updatedScriptData);
  } catch (error) {
    console.error("Error saving script:", error);
  }
};

export const saveNodes = async (scriptId: any, nodes: any) => {
  try {
    const nodesRef = ref(rtdb, `nodes/${scriptId}`);
    await set(nodesRef, nodes);
  } catch (error) {
    console.error("Error saving script:", error);
  }
};

export const subscribeToScript = (localScript: any, onUpdate: any) => {
  const scriptRef = doc(db, "scripts", localScript.id);

  const unsubscribeScript = onSnapshot(scriptRef, (scriptSnapshot) => {
    if (scriptSnapshot.exists()) {
      const scriptData = scriptSnapshot.data();
      // Return only metadata—do not merge local nodes.
      const serverScript = {
        id: localScript.id,
        ...scriptData,
      };
      onUpdate(serverScript);
    }
  });

  return unsubscribeScript;
};

// rtdb nodes compliant
export const subscribeToNodes = (localScript: any, onUpdate: any) => {
  const nodesRef = ref(rtdb, `nodes/${localScript.id}`);

  const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
    const nodesData = snapshot.exists() ? snapshot.val() : [emptyNode];
    // Return an object with just the nodes.
    onUpdate({ nodes: nodesData });
  });

  return () => off(nodesRef, "value", unsubscribeNodes);
};

// rtdb nodes compliant
export const getRealtimeNodes = (scriptId: any, onUpdate: any) => {
  const nodesRef = ref(rtdb, `nodes/${scriptId}`);

  const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
    if (snapshot.exists()) {
      const latestNodes = snapshot.val();
      onUpdate(latestNodes);
    } else {
      console.error("Nodes not found using script id: " + scriptId);
    }
  });

  return () => off(nodesRef, "value", unsubscribeNodes);
};

export const subscribeToRecentScripts = (
  userId: string,
  onUpdate: (data: any) => void
) => {
  const scriptsCollection = collection(db, "scripts");

  const q = query(
    scriptsCollection,
    where("createdBy", "==", userId),
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

export const getUsersByEmail = async (
  userEmails: any,
  exceptionEmails: any
) => {
  if (userEmails.length === 0) {
    return [];
  }

  try {
    const userDocs = await Promise.all(
      userEmails.map(async (email: any) => {
        if (exceptionEmails.includes(email)) {
          return null;
        }

        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", email));
        const queySnap = await getDocs(q);

        if (!queySnap.empty) {
          const userDoc = queySnap.docs[0];
          return { id: userDoc.id, ...userDoc.data() };
        }

        console.warn(`No document found for email: ${email}`);
        return null;
      })
    );

    return userDocs.filter((doc) => doc !== null);
  } catch (error) {
    console.error("Error fetching user documents:", error);
    throw error;
  }
};

export const addScriptGuest = async (script: any, newGuestAlias: any) => {
  try {
    if (script.guests.includes(newGuestAlias)) {
      throw new Error("Guest alias already exists in the script.");
    }

    const updatedGuests = [...script.guests, newGuestAlias];
    const docRef = doc(db, "scripts", script.id);

    await updateDoc(docRef, { guests: updatedGuests });
  } catch (error: any) {
    console.error("Error adding guest:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Guest added successfully." };
};

// rtdb nodes compliant
export const changeNodeSpeaker = async (
  scriptId: any,
  nodePosition: string, // Using nodeId instead of position for better scalability
  speakerId: string,
  isGuest: boolean
) => {
  try {
    const nodeRef = ref(rtdb, `nodes/${scriptId}/${nodePosition}`);
    await update(nodeRef, { speaker: { id: speakerId, isGuest: isGuest } }); // Only updates the speaker field
  } catch (error) {
    console.error("Error changing node speaker", error);
  }
};

export const updateScriptParticipants = async (
  scriptId: any,
  newParticipants: any
) => {
  try {
    const scriptRef = doc(db, "scripts", scriptId);
    await updateDoc(scriptRef, newParticipants);

    return true; // Return success indicator
  } catch (error) {
    console.error("Error updating script participants", error);
    return false; // Return failure indicator
  }
};

export const updateNodes = async (scriptId: any, newNodes: any) => {
  try {
    const nodeRef = ref(rtdb, `nodes/${scriptId}`);
    await set(nodeRef, newNodes);
  } catch (error) {
    console.error("Error updating nodes", error);
  }
};

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
  presentationId: string,
  user: any,
  onParticipantsChange: any
) => {
  const presenceRef = ref(
    rtdb,
    `presentations/${presentationId}/participants/${user.id}`
  );
  const connectedRef = ref(rtdb, ".info/connected");
  const participantsRef = ref(
    rtdb,
    `presentations/${presentationId}/participants`
  );
  const presentationRef = ref(rtdb, `presentations/${presentationId}`);

  // Listener for connection status
  const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
    const isConnected = snapshot.val();
    if (isConnected) {
      // Update the user's connection status in the database
      set(presenceRef, {
        role: user.role,
        isConnected: true,
      }).catch((error) => {
        console.error("Error setting presence:", error);
      });

      // Automatically update the user to disconnected status when they disconnect
      onDisconnect(presenceRef)
        .set({
          role: user.role,
          isConnected: false,
        })
        .then(() => {
          // Update the presentation's `lastParticipantDisconnectedAt` field
          onDisconnect(presentationRef)
            .update({
              lastParticipantDisconnectedAt: { ".sv": "timestamp" }, // Server timestamp
            })
            .catch((error) => {
              console.error(
                "Error updating lastParticipantDisconnectedAt:",
                error
              );
            });
        })
        .catch((error) => {
          console.error("Error setting disconnect status:", error);
        });
    }
  });

  // Optional: Listener for participants changes
  const unsubscribeParticipants = onValue(participantsRef, (snapshot) => {
    const participants = snapshot.val();
    onParticipantsChange(participants);
  });

  // Return a function to unsubscribe both listeners
  return () => {
    unsubscribeConnected();
    unsubscribeParticipants();
  };
};

export async function changeFavoriteStatus(scriptId: any, newStatus: any) {
  try {
    const docRef = doc(db, "scripts", scriptId);

    await updateDoc(docRef, { isFavorite: newStatus });
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
}

export async function onboardUser(userId: any, userData: any) {
  try {
    const docRef = doc(db, "users", userId);

    await updateDoc(docRef, userData);
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const preferencesDocRef = doc(db, "preferences", userId);
    const preferencesSnapshot = await getDoc(preferencesDocRef);

    const userPreferences = preferencesSnapshot.exists()
      ? preferencesSnapshot.data()
      : {};

    return { ...defaultPreferences, ...userPreferences };
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return defaultPreferences;
  }
}

export const subscribeToScripts = (
  userId: string,
  userEmail: string,
  onUpdate: (data: any) => void
) => {
  const scriptsCollection = collection(db, "scripts");

  // Queries for createdBy, editors, and viewers
  const createdByQuery = query(
    scriptsCollection,
    where("createdBy", "==", userId),
    orderBy("lastModified", "desc"),
    limit(10)
  );

  const editorsQuery = query(
    scriptsCollection,
    where("editors", "array-contains", userEmail),
    orderBy("lastModified", "desc"),
    limit(10)
  );

  const viewersQuery = query(
    scriptsCollection,
    where("viewers", "array-contains", userEmail),
    orderBy("lastModified", "desc"),
    limit(10)
  );

  const unsubscribeCreatedBy = onSnapshot(createdByQuery, (querySnapshot) => {
    const createdByData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    updateData(createdByData);
  });

  const unsubscribeEditors = onSnapshot(editorsQuery, (querySnapshot) => {
    const editorsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    updateData(editorsData);
  });

  const unsubscribeViewers = onSnapshot(viewersQuery, (querySnapshot) => {
    const viewersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    updateData(viewersData);
  });

  const allScripts: any[] = [];
  const updateData = (newData: any[]) => {
    allScripts.push(...newData);
    onUpdate(allScripts);
  };

  return () => {
    unsubscribeCreatedBy();
    unsubscribeEditors();
    unsubscribeViewers();
  };
};

export const subscribeToPresentationParticipants = (
  userId: any,
  onUpdate: any
) => {
  const presentationParticipantsCollection = collection(
    db,
    "presentationParticipants"
  );

  const q = query(
    presentationParticipantsCollection,
    where("participants", "array-contains", userId),
    orderBy("createdAt", "desc")
    // limit(10)
  );

  // Return the actual unsubscribe function from onSnapshot
  return onSnapshot(q, (querySnapshot) => {
    const presentationIds = querySnapshot.docs.map((doc) => doc.id);

    onUpdate(presentationIds);
  });
};

export const createPresentationSubscriptions = (
  onUpdate: (presentations: any[]) => void
) => {
  // Holds the latest data for each presentation.
  const presentationDataMap: Record<string, any> = {};
  // Holds the unsubscribe functions for each active presentation subscription.
  const subscriptions: Record<string, () => void> = {};

  const updateSubscriptions = (newPresentationIds: string[]) => {
    // 1. Subscribe to only new presentation IDs.
    newPresentationIds.forEach((id) => {
      if (!subscriptions[id]) {
        const presentationRef = ref(rtdb, `presentations/${id}`);
        const listener = onValue(presentationRef, (snapshot) => {
          const presentationData = snapshot.val();
          if (presentationData) {
            presentationDataMap[id] = { ...presentationData, id }; // Ensure ID is included
          } else {
            delete presentationDataMap[id]; // Handle case where presentation is deleted
          }

          // Build the ordered presentations array according to the newPresentationIds order.
          const orderedPresentations = newPresentationIds
            .map((pid) => presentationDataMap[pid])
            .filter(Boolean); // Remove any undefined entries

          onUpdate(orderedPresentations);
        });

        // Save the unsubscribe function.
        subscriptions[id] = () => off(presentationRef, "value", listener);
      }
    });

    // 2. Unsubscribe from IDs that are no longer in the list.
    Object.keys(subscriptions).forEach((id) => {
      if (!newPresentationIds.includes(id)) {
        subscriptions[id](); // Unsubscribe
        delete subscriptions[id];
        delete presentationDataMap[id];
      }
    });
  };

  const unsubscribeAll = () => {
    Object.keys(subscriptions).forEach((id) => subscriptions[id]());
  };

  return { updateSubscriptions, unsubscribeAll };
};

export const subscribeToNotifications = (
  userId: string,
  onUpdate: (data: any) => void
) => {
  const notificationsCollection = collection(db, "notifications");
  // Query notifications for the current user, ordered by createdAt descending.
  const q = query(
    notificationsCollection,
    where("targets", "array-contains", userId),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notificationsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    onUpdate(notificationsData);
  });

  return unsubscribe;
};

export async function getServerTimestampRTDB(): Promise<number> {
  try {
    const tempRef = ref(rtdb, "temp/serverTime");

    // Write server timestamp and read it back
    await set(tempRef, { timestamp: serverTimestamp() });

    const snapshot = await get(child(ref(rtdb), "temp/serverTime/timestamp"));

    if (!snapshot.exists()) {
      throw new Error("Failed to retrieve server timestamp.");
    }

    return snapshot.val();
  } catch (error) {
    console.error("Error getting server timestamp:", error);
    throw error;
  }
}

export async function updatePresentationStatus(
  presentationId: string,
  status: string
): Promise<void> {
  if (!presentationId || !status) {
    throw new Error("Both presentationId and status are required.");
  }

  try {
    const presentationRef = ref(rtdb, `/presentations/${presentationId}`);

    await update(presentationRef, { status });
  } catch (error) {
    console.error("Error updating presentation status:", error);
    throw error;
  }
}

export const checkPresentationStatus = async (presentations: any) => {
  try {
    const now = Date.now();

    const updatedPresentations = await Promise.all(
      presentations.map(async (presentation: any) => {
        if (
          presentation?.lastParticipantDisconnectedAt &&
          now - presentation.lastParticipantDisconnectedAt > gracePeriod
        ) {
          await updatePresentationStatus(presentation.id, "ended");
          return { ...presentation, status: "ended" };
        }
        return presentation;
      })
    );

    return updatedPresentations;
  } catch (error) {
    console.error("Error checking presentation status:", error);
    throw error;
  }
};

export const clearUnseenNotifications = async (notificationIds: string[]) => {
  try {
    const batchPromises = notificationIds.map(async (notificationId) => {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { unseen: false });
    });

    await Promise.all(batchPromises);
  } catch (error) {
    console.error("Error clearing unseen notifications:", error);
  }
};

export async function updateUserOnboardingData(userId: string, data: any) {
  if (!userId) throw new Error("User ID is required");

  // Build update object conditionally
  const updatePayload: any = {
    displayName: data.displayName,
    userType: data.userType,
    intendedUse: data.intendedUse,
    team: data.team,
  };

  // Origin logic
  if (data.origin) {
    updatePayload.origin =
      data.origin === "Other"
        ? data.otherOrigin?.trim() || "Other"
        : data.origin;
  }

  // Contacts logic
  if (data.team && data.contacts && data.contacts.length > 0) {
    updatePayload.contacts = data.contacts.filter((c: any) => c.trim() !== "");
  }

  // Reference and update
  const userRef = doc(db, "users", userId);

  try {
    await updateDoc(userRef, updatePayload);
    console.log("User onboarding data updated:", updatePayload);
  } catch (err) {
    console.error("Failed to update user document:", err);
    throw err;
  }
}
