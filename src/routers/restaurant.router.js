import express from "express";
const router = express.Router();

import { RestaurantController } from "../controllers/restaurant.controller.js";

router.post("/createRestaurant", RestaurantController.createRestaurant);
router.delete("/deleteRestaurant/:id", RestaurantController.deleteRestaurant);
router.put("/updateRestaurant/:id", RestaurantController.updateRestaurant);
router.post(
  "/checkRestaurantNotExists/",
  RestaurantController.checkRestaurantNotExists
);
export default router;
