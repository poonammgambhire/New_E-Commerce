import productModel from "../models/productModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const productData = {
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
    };

    if (req.file?.filename) productData.photo = req.file.filename;

    const product = new productModel(productData);
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CreateProductController Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
    });
  }
};

// GET ALL PRODUCTS
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("GetAllProductsController Error:", error);
    res.status(500).send({ success: false, message: "Error in getting products" });
  }
};

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug }).populate("category");
    if (!product)
      return res.status(404).send({ success: false, message: "Product not found" });

    res.status(200).send({ success: true, product });
  } catch (error) {
    console.error("GetSingleProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in getting product" });
  }
};

// RELATED PRODUCTS
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    // ✅ Validate IDs before using them
    if (!mongoose.Types.ObjectId.isValid(pid) || !mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        success: false,
        message: "Invalid product or category ID",
      });
    }

    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .populate("category")
      .limit(6);

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("RelatedProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in related products" });
  }
};

// FILTER PRODUCTS
export const filterProductController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;
    const args = {};

    if (Array.isArray(checked) && checked.length) args.category = checked;
    if (Array.isArray(radio) && radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args).populate("category");
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("FilterProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in filtering" });
  }
};

// SEARCH PRODUCTS
// SEARCH PRODUCTS
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).populate("category");

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("SearchProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in search" });
  }
};


// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const count = await productModel.countDocuments();
    res.status(200).send({ success: true, count });
  } catch (error) {
    console.error("ProductCountController Error:", error);
    res.status(500).send({ success: false, message: "Error in product count" });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    const updateData = {
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
    };

    if (req.file?.filename) updateData.photo = req.file.filename;

    const product = await productModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product)
      return res.status(404).send({ success: false, message: "Product not found" });

    res.status(200).send({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("UpdateProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in updating product" });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).send({ success: false, message: "Product not found" });

    res.status(200).send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DeleteProductController Error:", error);
    res.status(500).send({ success: false, message: "Error in deleting product" });
  }
};

