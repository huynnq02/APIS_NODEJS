import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { BillController } from "../controllers/bill.controller.js";

router.post("/createBill",  BillController.createBill);
router.delete("/deleteBill/:id",  BillController.deleteBill);
router.put("/updateOrder/:id",  BillController.updateBill);
router.get(
  "/getAllBillOfRestaurant/:restaurantID",
 
  BillController.getAllBillOfRestaurant
);
export default router;
