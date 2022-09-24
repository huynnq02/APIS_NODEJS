import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { OrderController } from "../controllers/order.controller.js";

router.post("/createOrder", verifyToken, OrderController.createOrder);
router.delete("/deleteOrder/:id", verifyToken, OrderController.deleteOrder);
router.put("/updateOrder", verifyToken, OrderController.updateOrder);
router.get(
  "/getAllOrderOfRestaurant/:restaurantID",
  verifyToken,
  OrderController.getAllOrderOfRestaurant
);
router.post(
  "/getOrderInfo/:tableID",
  verifyToken,
  OrderController.getOrderInfo
);
router.post("/isExistingOder", verifyToken, OrderController.isExistingOder);
router.post(
  "/getCurrentOrderID",
  verifyToken,
  OrderController.getCurrentOrderID
);

// router.get("/getAllOrder", OrderController.getAllOrder);
export default router;
