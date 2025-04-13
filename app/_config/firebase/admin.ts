import "server-only";
import admin from "firebase-admin";

const base64EncodedServiceAccount: any =
  process.env.FIREBASE_BASE64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf-8");
const credentials = JSON.parse(decodedServiceAccount);

const adminConfig = {
  projectId: credentials.project_id,
  clientEmail: credentials.client_email,
  privateKey: credentials.private_key,
};

// Initialize the admin app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}

export { admin };
