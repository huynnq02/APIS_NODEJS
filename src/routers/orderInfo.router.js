import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { OrderInfoController } from "../controllers/orderInfo.controller.js";

router.post(
  "/createOrderInfo/",
 
  OrderInfoController.createOrderInfo
);
router.delete(
  "/deleteOrderInfo/:id",
 
  OrderInfoController.deleteOrderInfo
);
router.put(
  "/updateOrderInfo/:id",
 
  OrderInfoController.updateOrderInfo
);
router.get(
  "/getAllOrderInfoOfRestaurant/:restaurantID",

  OrderInfoController.getAllOrderInfoOfRestaurant
);
router.post("/getOrderInfo/",  OrderInfoController.getOrderInfo);

export default router;
