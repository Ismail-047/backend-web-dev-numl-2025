import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
});

export default admin;