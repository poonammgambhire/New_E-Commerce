import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",   // ✅ must match productModel registration
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // ✅ must match userModel registration
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
