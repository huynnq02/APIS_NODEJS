import express from "express";
const router = express.Router();
import { OrderInfoController } from "./orderInfoController";

router.post("/createOrderInfo/", OrderInfoController.createOrderInfo);
router.delete("/deleteOrderInfo/:id", OrderInfoController.deleteOrderInfo);
router.put("/updateOrderInfo/:id", OrderInfoController.updateOrderInfo);
router.get(
  "/getAllOrderInfoOfRestaurant/:restaurantID",
  OrderInfoController.getAllOrderInfoOfRestaurant
);
export default router;
