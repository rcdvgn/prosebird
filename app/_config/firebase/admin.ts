import "server-only";
import admin from "firebase-admin"; // Import the module as a whole, not destructured

const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialize the admin app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: "https://prosebird-5ba8b-default-rtdb.firebaseio.com",
  });
}

export { admin };
