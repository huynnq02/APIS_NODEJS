import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { OrderInfoController } from "../controllers/orderInfo.controller.js";

router.post(
  "/createOrderInfo/",
  verifyToken,
  OrderInfoController.createOrderInfo
);
router.delete(
  "/deleteOrderInfo/:id",
  verifyToken,
  OrderInfoController.deleteOrderInfo
);
router.put(
  "/updateOrderInfo/:id",
  verifyToken,
  OrderInfoController.updateOrderInfo
);
router.get(
  "/getAllOrderInfoOfRestaurant/:restaurantID",
  verifyToken,
  OrderInfoController.getAllOrderInfoOfRestaurant
);
router.post("/getOrderInfo/", verifyToken, OrderInfoController.getOrderInfo);

export default router;
