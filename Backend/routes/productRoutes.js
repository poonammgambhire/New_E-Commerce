import express from "express";
import {
  createProductController,
  getAllProductsController,
  getSingleProductController,
  relatedProductController,
  filterProductController,
  searchProductController,
  productCountController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddlewares.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// ── Public Routes ──
// Get all products
router.get("/get-all-products", getAllProductsController);

// Get single product by slug
router.get("/get-product/:slug", getSingleProductController);

// Get related products by product ID and category ID
router.get("/related/:pid/:cid", relatedProductController);

// Filter products (categories + price range)
router.post("/filter-products", filterProductController);

// Search products by keyword
router.get("/search/:keyword", searchProductController);
// Get total product count
router.get("/product-count", productCountController);

// ── Admin Routes ──
// Create product (with image upload)
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  createProductController
);

// Update product by ID (with optional image upload)
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  upload.single("photo"),
  updateProductController
);

// Delete product by ID
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);


export default router;