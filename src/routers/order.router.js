import express from "express";
const router = express.Router();

import { OrderController } from "../controllers/order.controller.js";

router.post("/createOrder/:tableID", OrderController.createOrder);
router.delete("/deleteOrder/:id", OrderController.deleteOrder);
router.put("/updateOrder/:id", OrderController.updateOrder);
router.get(
  "/getAllOrderOfRestaurant/:restaurantID",
  OrderController.getAllOrderOfRestaurant
);
// router.get("/getAllOrder", OrderController.getAllOrder);
export default router;
