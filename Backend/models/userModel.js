import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"]
    },

    address: {
      type: String,
      required: [true, "Address is required"]
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // 👇 OTP Fields add kele
    otp: {
      type: String,
      default: "",
    },

    otpExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;