import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { TestingController } from "../controllers/example.controller.js";

router.get("/servertest", TestingController.serverTesting);
router.get("/accounttest", TestingController.accountTesting);

export default router;
