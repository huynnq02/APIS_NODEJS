import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { FoodController } from "../controllers/food.controller.js";

router.post("/addFood/:restaurantID", FoodController.addFood);
router.delete("/deleteFood/:id", FoodController.deleteFood);
router.put("/updateFood/:id", FoodController.updateFood);
router.get(
  "/getAllFoodOfRestaurant/:restaurantID",

  FoodController.getAllFoodOfRestaurant
);
router.post(
  "/getAllFoodWithType/:restaurantID",

  FoodController.getAllFoodWithType
);
router.post("/foodDiscount", FoodController.foodDiscount);
export default router;
