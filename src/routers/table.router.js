import express from "express";
const router = express.Router();

import { TableController } from "../controllers/table.controller.js";

router.post("/createTable/:restaurantID", TableController.createTable);
router.delete("/deleteTable/:id", TableController.deleteTable);
router.put("/updateTable/:id", TableController.updateTable);
router.get("/getAllTable/:restaurantID", TableController.getAllTable);
export default router;