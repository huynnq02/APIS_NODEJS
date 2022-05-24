import client from "twilio";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" assert { type: "json" };

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const SMSclient = new client(accountSid, authToken);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
        from: "+19785156306",
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
        .doc(phoneNumber)
        .get();
      if (user.data().otp == otp) {
        await db
          .collection("Otp")
          .doc(phoneNumber)
          .delete();
        res.status(200).json({
          success: true,
          message: "OTP verified",
        });
      } else {
        res.status(500).json({
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
  }
};
