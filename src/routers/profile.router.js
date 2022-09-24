import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";
import { ProfileController } from "../controllers/profile.controller.js";

router.post("/update/:username", verifyToken, ProfileController.updateInfo);
router.get(
  "/getUserProfile/:username",
  verifyToken,
  ProfileController.getUserProfile
);

export default router;
