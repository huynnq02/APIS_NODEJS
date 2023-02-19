import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";
import { TableController } from "../controllers/table.controller.js";

router.post("/createTable/:restaurantID", TableController.createTable);
router.delete("/deleteTable/:restaurantID", TableController.deleteTable);
router.put("/updateTable/:restaurantID", TableController.updateTable);
router.put("/updateBusyTable", TableController.updateBusyTable);

router.get(
  "/getAllTable/:restaurantID",

  TableController.getAllTable
);
router.post(
  "/getAllTableOfRestaurant",

  TableController.getAllTableOfRestaurant
);

export default router;
