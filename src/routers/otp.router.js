import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";
import { OtpController } from "../controllers/otp.controller.js";

router.post("/sendOtp", verifyToken, OtpController.sendOtp);
router.post("/verifyOtp", verifyToken, OtpController.verifyOtp);
export default router;
