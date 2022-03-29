import express from "express";
const router = express.Router();

import { MenuController } from "../controllers/menu.controller.js";

router.post("/createMenu/:restaurantID", MenuController.createMenu);
router.delete("/deleteMenu/:id", MenuController.deleteMenu);
router.put("/updateMenu/:id", MenuController.updateMenu);
router.get("/getAllMenu/:restaurantID", MenuController.getAllMenu);
export default router;
