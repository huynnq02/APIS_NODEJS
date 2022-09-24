import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";
import { TableController } from "../controllers/table.controller.js";

router.post("/createTable", verifyToken, TableController.createTable);
router.delete("/deleteTable/:id", verifyToken, TableController.deleteTable);
router.put("/updateTable/:id", verifyToken, TableController.updateTable);
router.put("/updateBusyTable", verifyToken, TableController.updateBusyTable);

router.get(
  "/getAllTable/:restaurantID",
  verifyToken,
  TableController.getAllTable
);
router.post(
  "/getAllTableOfRestaurant",
  verifyToken,
  TableController.getAllTableOfRestaurant
);

export default router;
