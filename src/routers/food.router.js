import express from "express";
const router = express.Router();

import { FoodController } from "../controllers/food.controller.js";

router.post("/addFood/:menuID", FoodController.addFood);
router.delete("/deleteFood/:id", FoodController.deleteFood);
router.put("/updateFood/:id", FoodController.updateFood);

export default router;
