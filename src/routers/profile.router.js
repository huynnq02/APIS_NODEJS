import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";
import { ProfileController } from "../controllers/profile.controller.js";

router.post("/update/:username", ProfileController.updateInfo);
router.get(
  "/getUserProfile/:username",
 
  ProfileController.getUserProfile
);

export default router;
