import express from "express";
const router = express.Router();

import { BillController } from "../controllers/bill.controller.js";

router.post("/createBill/:orderID", BillController.createBill);
router.delete("/deleteBill/:id", BillController.deleteBill);
router.put("/updateOrder/:id", BillController.updateBill);
router.get(
  "/getAllBillOfRestaurant/:restaurantID",
  BillController.getAllBillOfRestaurant
);
export default router;
