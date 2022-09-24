import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { BillController } from "../controllers/bill.controller.js";

router.post("/createBill", verifyToken, BillController.createBill);
router.delete("/deleteBill/:id", verifyToken, BillController.deleteBill);
router.put("/updateOrder/:id", verifyToken, BillController.updateBill);
router.get(
  "/getAllBillOfRestaurant/:restaurantID",
  verifyToken,
  BillController.getAllBillOfRestaurant
);
export default router;
