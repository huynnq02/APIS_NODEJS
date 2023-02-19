import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { OrderController } from "../controllers/order.controller.js";

router.post("/createOrder/:restaurantID", OrderController.createOrder);
router.delete("/deleteOrder/:id", OrderController.deleteOrder);
router.put("/updateOrder", OrderController.updateOrder);
router.get(
  "/getAllOrderOfRestaurant/:restaurantID",

  OrderController.getAllOrderOfRestaurant
);
router.post(
  "/getOrderInfo/:tableID",

  OrderController.getOrderInfo
);
router.post("/isExistingOder", OrderController.isExistingOder);
router.post(
  "/getCurrentOrderID",

  OrderController.getCurrentOrderID
);

// router.get("/getAllOrder", OrderController.getAllOrder);
export default router;
