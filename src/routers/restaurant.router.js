import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { RestaurantController } from "../controllers/restaurant.controller.js";

router.post(
  "/createRestaurant",
  verifyToken,
  RestaurantController.createRestaurant
);
router.delete(
  "/deleteRestaurant/:id",
  verifyToken,
  RestaurantController.deleteRestaurant
);
router.post(
  "/updateRestaurant/:username",
  verifyToken,
  RestaurantController.updateRestaurant
);
router.post(
  "/checkRestaurantNotExists/",
  verifyToken,
  RestaurantController.checkRestaurantNotExists
);
router.get(
  "/getRestaurant/:username",
  verifyToken,
  RestaurantController.getRestaurantData
);
export default router;
