import express from "express";
const router = express.Router();
import verifyToken from "../middlewares/auth.js";

import { MenuController } from "../controllers/menu.controller.js";

router.post(
  "/createMenu/:restaurantID",
  verifyToken,
  MenuController.createMenu
);
router.delete("/deleteMenu/:id", MenuController.deleteMenu);
router.put("/updateMenu/:id",  MenuController.updateMenu);
router.get("/getAllMenu/:restaurantID",  MenuController.getAllMenu);
export default router;
