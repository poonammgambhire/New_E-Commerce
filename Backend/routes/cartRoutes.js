import express from "express";
import {
  addToCartController,
  getCartController,
  removeFromCartController,
} from "../controllers/cartController.js";

import { requireSignIn } from "../middlewares/authMiddlewares.js";

const router = express.Router();


// 🟢 ADD TO CART
router.post("/cart/add", requireSignIn, addToCartController);


// 🟢 GET CART
router.get("/cart", requireSignIn, getCartController);


// 🟢 REMOVE FROM CART
router.post("/cart/remove", requireSignIn, removeFromCartController);


export default router;