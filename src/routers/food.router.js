import express from "express";
const router = express.Router();

import { FoodController } from "../controllers/food.controller.js";

router.post("/addFood/:username", FoodController.addFood);
router.delete("/deleteFood/:id", FoodController.deleteFood);
router.put("/updateFood/:id", FoodController.updateFood);
router.post("/getAllFoodOfRestaurant", FoodController.getAllFoodOfRestaurant);
router.post("/getAllFoodWithType", FoodController.getAllFoodWithType);
router.post("/foodDiscount", FoodController.foodDiscount);
export default router;
