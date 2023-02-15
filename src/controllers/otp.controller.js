import client from "twilio";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const SMSclient = new client(apiKey, apiSecret, { accountSid: accountSid });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_URL,
  });
} else {
  admin.app();
}
const db = admin.firestore();
export const OtpController = {
  sendOtp: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000);
      await db.collection("Otp").doc(phoneNumber).set({
        otp: otp,
      });
      const message = await SMSclient.messages.create({
        body: "Your OTP is: " + otp,
        from: "+14452694321",
        to: phoneNumber,
      });
      console.log(message.sid);
      res.status(200).json({
        success: true,
        message: "OTP sent",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      const user = await db
        .collection("Otp")
        .doc(`+84${phoneNumber.slice(1, phoneNumber.length)}`)
        .get();
      console.log(user.data());
      if (!user.data()) {
        res.status(202).json({
          success: false,
          message: "Phone Number not found. Please try again from register.",
        });
        return;
      }
      if (user.data().otp == otp) {
        console.log("=");
        await db
          .collection("Otp")
          .doc(`+84${phoneNumber.slice(1, phoneNumber.length)}`)
          .delete();
        const userlists = db.collection("Users");
        const query = userlists.where("phoneNumber", "==", phoneNumber);
        query.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            res.status(202).json({
              success: false,
              message:
                "Phone Number not found. Please try again from register.",
            });
            return;
          }

          querySnapshot.forEach((doc) => {
            doc.ref.update({ status: "verified" });
          });
        });
        res.status(200).json({
          success: true,
          message: "OTP verified",
        });
      } else {
        res.status(202).json({
          success: false,
          message: "OTP not match",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
};
