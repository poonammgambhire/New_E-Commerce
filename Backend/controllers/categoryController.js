import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name, { lower: true, strict: true }),
    }).save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Create category API error",
      error: error.message,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Update category API error",
      error: error.message,
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All categories fetched successfully",
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single category fetched",
      category,
    });
  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching single category",
      error: error.message,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.log("ERROR 👉", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};