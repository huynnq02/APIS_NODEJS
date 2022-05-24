import express from "express";
const router = express.Router();

import { FoodController } from "../controllers/food.controller.js";

router.post("/addFood/", FoodController.addFood);
router.delete("/deleteFood/:id", FoodController.deleteFood);
router.put("/updateFood/:id", FoodController.updateFood);
router.get(
  "/getAllFoodOfRestaurant/:restaurantID",
  FoodController.getAllFoodOfRestaurant
);
router.get("getAllFoodOfMenu/:menuID", FoodController.getAllFoodOfMenu);
export default router;
