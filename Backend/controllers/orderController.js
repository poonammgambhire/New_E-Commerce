import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";

// Create new order
export const createOrderController = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).send({ success: false, message: "Products are required" });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).send({ success: false, message: "Valid totalAmount is required" });
    }

    const order = await new orderModel({
      products,
      buyer: req.user._id,
      totalAmount,
    }).save();

    res.status(201).send({ success: true, message: "Order placed successfully!", order });
  } catch (error) {
    console.error("CreateOrder Error:", error);
    res.status(500).send({ success: false, message: "Error placing order" });
  }
};

// Get orders for logged-in user
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products.product", "name price photo slug")
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, total: orders.length, orders });
  } catch (error) {
    console.error("GetUserOrders Error:", error);
    res.status(500).send({ success: false, message: "Error fetching orders" });
  }
};

// Get all orders — Admin only
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product", "name price photo slug")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, total: orders.length, orders });
  } catch (error) {
    console.error("GetAllOrders Error:", error);
    res.status(500).send({ success: false, message: "Error fetching all orders" });
  }
};

// Update order status — Admin only
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send({ success: false, message: "Invalid order ID" });
    }

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });

    res.status(200).send({ success: true, message: "Order status updated!", order });
  } catch (error) {
    console.error("UpdateOrderStatus Error:", error);
    res.status(500).send({ success: false, message: "Error updating order status" });
  }
};

// Dashboard stats — Admin only
export const getDashboardStatsController = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalRevenue = await orderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.status(200).send({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("DashboardStats Error:", error);
    res.status(500).send({ success: false, message: "Error fetching stats" });
  }
};