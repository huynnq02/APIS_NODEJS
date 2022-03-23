import express from "express";
const router = express.Router();

import {AuthController} from "../controllers/auth.controller.js";

router.post('/createUser', AuthController.createUser);


export default router;

