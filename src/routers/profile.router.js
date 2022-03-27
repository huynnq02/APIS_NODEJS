import express from "express";
const router = express.Router();

import { ProfileController } from "../controllers/profile.controller.js";

router.post("/update", ProfileController.updateInfo);

export default router;
