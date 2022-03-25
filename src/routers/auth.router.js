import express from "express";
const router = express.Router();

import {AuthController} from "../controllers/auth.controller.js";

router.post('/createUser', AuthController.createUser);
router.get('/login', AuthController.loginUser)


export default router;

