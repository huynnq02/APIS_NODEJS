import express from "express";
const router = express.Router();

import {AuthController} from "../controllers/auth.controller.js";

router.post('/createUser/:role', AuthController.createUser);
router.get('/login', AuthController.loginUser);
router.post('/register', AuthController.registerUser);


export default router;

