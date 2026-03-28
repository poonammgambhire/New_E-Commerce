import express from "express";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  getDashboardStatsController,
} from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// User routes
router.post("/create", requireSignIn, createOrderController);
router.get("/user-orders", requireSignIn, getUserOrdersController);

// Admin routes
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/status/:orderId", requireSignIn, isAdmin, updateOrderStatusController);
router.get("/dashboard-stats", requireSignIn, isAdmin, getDashboardStatsController);

export default router;
