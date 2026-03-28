import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyOtpController,
  resetPasswordController,
  testController,
  getAllUsersController,
  updateProfileController,
  // ✅ NEW: import userAuthController for Private.jsx route guard
  userAuthController,
} from "../controllers/authControllers.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Public routes
router.post("/register",        registerController);
router.post("/login",           loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp",      verifyOtpController);
router.post("/reset-password",  resetPasswordController);

// ✅ FIX: This route is called by Private.jsx to verify a logged-in user's token
router.get("/user-auth", requireSignIn, userAuthController);

// Admin routes
router.get("/test",       requireSignIn, isAdmin, testController);
router.get("/all-users",  requireSignIn, isAdmin, getAllUsersController);

// Protected user routes
router.put("/profile", requireSignIn, updateProfileController);

export default router;