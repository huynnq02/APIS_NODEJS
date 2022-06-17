import express from "express";
const router = express.Router();

import { AuthController } from "../controllers/auth.controller.js";

router.post("/createUser/:usernameOwner", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.get("/getAllUser/:username", AuthController.getAllUser);
router.post("/hasNoRestaurant", AuthController.hasNoRestaurant);
router.put("/updateUser", AuthController.updateUser);
router.put("/changePassword", AuthController.changePassword);
router.post("/forgotPassword", AuthController.forgotPassword);
router.get(
  "/checkPhoneNumber/:phoneNumber",
  AuthController.checkPhoneNumberInfo
);
router.get("/checkUsername/:username", AuthController.checkUsernameInfo);

export default router;
