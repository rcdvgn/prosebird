import "server-only";

import { admin } from "@/app/_config/firebase/admin";
const rtdb = admin.database();
const db = admin.firestore();
const auth = admin.auth();
import generatePresentationCode from "../_lib/generatePresentationCode";

export const getPresentationByCode = async (presentationCode: string) => {
  try {
    // Initialize RTDB reference using Admin SDK
    const presentationsRef = rtdb.ref("/presentations");

    // Query the RTDB for the presentation with the matching code
    const snapshot = await presentationsRef
      .orderByChild("code")
      .equalTo(presentationCode)
      .once("value");

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

export async function updatePresentationStatus(
  presentationId: string,
  status: string
): Promise<void> {
  try {
    if (!presentationId || !status) {
      throw new Error("Both presentationId and status are required.");
    }

    const presentationRef = rtdb.ref(`/presentations/${presentationId}`);

    // Update the presentation's status
    await presentationRef.update({ status });
    console.log(`Presentation ${presentationId} status updated to ${status}.`);
  } catch (error) {
    console.error("Error updating presentation status:", error);
    throw error;
  }
}

export async function getServerTimestampRTDB(): Promise<number> {
  const tempRef = rtdb.ref("temp/serverTime");
  await tempRef.set({ ".sv": "timestamp" });

  const snapshot = await tempRef.once("value");
  return snapshot.val();
}

export async function createPresentation(presentation: any) {
  //   console.log(admin);
  try {
    // Initialize RTDB reference using Admin SDK
    const presentationsRef = rtdb.ref("presentations");

    // Push the presentation data to RTDB
    const newPresentationRef = presentationsRef.push();
    await newPresentationRef.set(presentation);

    console.log(`Presentation created with ID: ${newPresentationRef.key}`);
    return newPresentationRef.key;
  } catch (error) {
    console.error("Error creating presentation:", error);
    throw error;
  }
}

// export async function generateUniquePresentationCode() {
//     let generatedCode: string;
//     let querySnapshot;
//     const presentationsRef = collection(db, "presentations");

//     do {
//       generatedCode = generatePresentationCode();
//       const q = query(presentationsRef, where("code", "==", generatedCode));
//       querySnapshot = await getDocs(q);
//     } while (!querySnapshot.empty);

//     return generatedCode;
//   }

export async function generateUniquePresentationCode(): Promise<string> {
  try {
    const presentationsRef = db.collection("presentations");

    let generatedCode: string;
    let isCodeUnique: boolean;

    do {
      // Generate a new code
      generatedCode = generatePresentationCode();

      // Query Firestore for documents with the matching code
      const querySnapshot = await presentationsRef
        .where("code", "==", generatedCode)
        .get();

      // Check if the query result is empty
      isCodeUnique = querySnapshot.empty;
    } while (!isCodeUnique);

    return generatedCode;
  } catch (error) {
    console.error("Error generating unique presentation code:", error);
    throw error;
  }
}

export const updatePresentation = async (
  presentationId: any,
  position: any,
  userId: any
) => {
  const lastMessageRef = rtdb.ref(
    `presentations/${presentationId}/lastMessage`
  );

  await lastMessageRef.update({
    position: position,
    senderId: userId,
  });
};

// export const updateCustomerSubscription = async (
//   userId: string,
//   subscriptionData: Record<string, any>
// ) => {
//   try {
//     const docRef = db.collection("users").doc(userId);

//     await docRef.update(subscriptionData);

//     console.log(`Successfully updated plan for user: ${userId}`);
//   } catch (error) {
//     console.error("Error updating customer plan:", error);
//     throw error;
//   }
// };

export const updateCustomerSubscription = async (
  userId: string,
  subscriptionData: Record<string, any>
) => {
  try {
    const docRef = db.collection("users").doc(userId);
    await docRef.update(subscriptionData);
    console.log(`Successfully updated subscription for user: ${userId}`);
  } catch (error) {
    console.error("Error updating customer subscription:", error);
    throw error;
  }
};

export const handleSubscriptionDeletion = async (customerId: any) => {
  try {
    const userDoc = await db
      .collection("users")
      .where("customerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      const userId = userDoc.docs[0].id;
      await updateCustomerSubscription(userId, {
        subscriptionStatus: "canceled",
      });
    } else {
      console.error(`No user found for customerId: ${customerId}`);
    }
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
    throw error;
  }
};

export const handleSubscriptionUpdate = async (subscription: any) => {
  try {
    const customerId = subscription.customer;
    const planName = subscription.items.data[0].price.id;
    const status = subscription.status;

    const userDoc = await db
      .collection("users")
      .where("customerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      const userId = userDoc.docs[0].id;
      await updateCustomerSubscription(userId, {
        subscriptionStatus: status,
        planName: planName || null,
      });
    } else {
      console.error(`No user found for customerId: ${customerId}`);
    }
  } catch (error) {
    console.error("Error handling subscription update:", error);
    throw error;
  }
};

export const addPresentationParticipants = async (
  presentationId: string,
  participants: string[]
) => {
  try {
    // Create or update the presentation document in Firestore
    const presentationDocRef = db
      .collection("presentationParticipants")
      .doc(presentationId);

    await presentationDocRef.set(
      {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        participants: participants,
      },
      { merge: true } // Merge to prevent overwriting other fields if they already exist
    );

    console.log(`Presentation ${presentationId} updated successfully.`);
  } catch (error) {
    console.error(`Failed to update presentation ${presentationId}:`, error);
    throw new Error("Failed to update presentation participants.");
  }
};

export async function userExists(email: string): Promise<boolean> {
  const userSnap = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();
  return !userSnap.empty;
}

export async function saveVerificationCode(
  email: string,
  code: string,
  expiresAt: number,
  verifyToken: string
) {
  await db.collection("emailVerifications").doc(email).set({
    code,
    expiresAt,
    verifyToken,
  });
}

export async function getEmailVerification(email: string) {
  const doc = await db.collection("emailVerifications").doc(email).get();
  return doc.exists ? doc.data() : null;
}

export async function getEmailVerificationByToken(token: string) {
  const snapshot = await db
    .collection("emailVerifications")
    .where("verifyToken", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    email: doc.id, // ✅ the doc ID *is* the email
    verifyToken: data.verifyToken,
    expiresAt: data.expiresAt,
    code: data.code,
    ref: doc.ref,
  };
}

export async function createFirebaseUser(email: string, password: string) {
  return await auth.createUser({ email, password });
}
