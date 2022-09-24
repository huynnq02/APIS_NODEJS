import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { AuthController } from "../controllers/auth.controller.js";

router.put("/refreshToken", AuthController.refreshToken);
router.post(
  "/createUser/:usernameOwner",
  verifyToken,
  AuthController.createUser
);
router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.get("/getAllUser/:username", verifyToken, AuthController.getAllUser);
router.post("/hasNoRestaurant", verifyToken, AuthController.hasNoRestaurant);
router.put("/updateUser", verifyToken, AuthController.updateUser);
router.put("/changePassword", verifyToken, AuthController.changePassword);
router.post("/forgotPassword", verifyToken, AuthController.forgotPassword);
router.get(
  "/checkPhoneNumber/:phoneNumber",
  verifyToken,
  AuthController.checkPhoneNumberInfo
);
router.get(
  "/checkUsername/:username",
  verifyToken,
  AuthController.checkUsernameInfo
);

export default router;
