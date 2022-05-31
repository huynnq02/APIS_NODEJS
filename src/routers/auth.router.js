import express from "express";
const router = express.Router();

import { AuthController } from "../controllers/auth.controller.js";

router.post("/createUser/:role", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.get("/getAllUser", AuthController.getAllUser);
router.get("/hasRestaurant", AuthController.hasRestaurant);
export default router;
