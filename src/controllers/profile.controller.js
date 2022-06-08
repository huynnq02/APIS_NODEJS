import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { getStorage } from "firebase-admin/storage";
dotenv.config();

//*Region connect to database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_URL,
  });
} else {
  admin.app();
}
const db = admin.firestore();
const bucket = admin.storage().bucket();
export const ProfileController = {
  //*Set infomation for account
  updateInfo: async (req, res) => {
    try {
      console.log("username: " + req.params.username);
      console.log("req.body: " + req.body);
      const user = await db.collection("Users").doc(req.params.username).get();
      console.log("user: " + user);
      if (!user.data()) {
        res.status(501).json({
          success: false,
          message: "Invalid username",
        });
        return;
      }
      if (req.body.password) {
        if (req.body.password.length < 6) {
          res.status(501).json({
            success: false,
            message: "Password must be at least 6 characters",
          });
          return;
        }
      }
      console.log(req.body.imagePath);
      await db.collection("Users").doc(req.params.username).set({
        fullname: req.body.fullname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        imagePath: req.body.imagePath,
      }, { merge: true });
     
      console.log("userSetdata: true");
      res.status(200).json({
        success: true,
        message: "Profile Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
};
