import express from "express";
const router = express.Router();

import { MenuController } from "../controllers/menu.controller.js";

router.post("/createMenu/:restaurantID", MenuController.createMenu);
// router.delete("/deleteRestaurant/:id", RestaurantController.deleteRestaurant);
// router.get("/updateRestaurant/:id", RestaurantController.updateRestaurant);

export default router;
