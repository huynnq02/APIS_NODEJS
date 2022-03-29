import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };
import validator from "validator";
import bcrypt from "bcrypt";

//*Region connect to database
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();
}
const db = admin.firestore();

export const ProfileController = {
  //*Set infomation for account
  updateInfo: async (req, res) => {
    try {
      const user = await db.collection("Users").doc(req.params.username).get();
      const data = {
        age: res.body.age,
        address: res.body.address,
        gender: res.body.gender,
        nationality: res.body.nationality,
      };
      user.set(data);
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
