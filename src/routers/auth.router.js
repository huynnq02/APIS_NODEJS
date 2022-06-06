import express from "express";
const router = express.Router();

import { AuthController } from "../controllers/auth.controller.js";

router.post("/createUser/:role", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.get("/getAllUser", AuthController.getAllUser);
router.post("/hasNoRestaurant", AuthController.hasNoRestaurant);
router.put("/updateUser", AuthController.updateUser);
router.post("/changePassword/", AuthController.changePassword);
router.post("/forgotPassword", AuthController.forgotPassword);
export default router;
