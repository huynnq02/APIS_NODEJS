import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { FoodController } from "../controllers/food.controller.js";

router.post("/addFood/:username", verifyToken, FoodController.addFood);
router.delete("/deleteFood/:id", verifyToken, FoodController.deleteFood);
router.put("/updateFood/:id", verifyToken, FoodController.updateFood);
router.post(
  "/getAllFoodOfRestaurant",
  verifyToken,
  FoodController.getAllFoodOfRestaurant
);
router.post(
  "/getAllFoodWithType",
  verifyToken,
  FoodController.getAllFoodWithType
);
router.post("/foodDiscount", verifyToken, FoodController.foodDiscount);
export default router;
