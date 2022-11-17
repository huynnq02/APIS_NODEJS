import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { RestaurantController } from "../controllers/restaurant.controller.js";

router.post(
  "/createRestaurant",
  
  RestaurantController.createRestaurant
);
router.delete(
  "/deleteRestaurant/:id",
  
  RestaurantController.deleteRestaurant
);
router.post(
  "/updateRestaurant/:username",
  
  RestaurantController.updateRestaurant
);
router.post(
  "/checkRestaurantNotExists/",
  
  RestaurantController.checkRestaurantNotExists
);
router.get(
  "/getRestaurant/:username",
 
  RestaurantController.getRestaurantData
);
export default router;
