import express from "express";
const router = express.Router();

import { RestaurantController } from "../controllers/restaurant.controller.js";

router.post("/createRestaurant", RestaurantController.createRestaurant);
// router.get("/login", Res.loginUser);

export default router;
