import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name, email, password: hashedPassword, phone, address, role,
    }).save();

    // ✅ FIX: use CLIENT_URL env var instead of hardcoded localhost
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to MyShop! 🛒",
      html: `
        <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0d6efd; text-align: center;">🛒 MyShop</h2>
          <hr/>
          <h3 style="text-align: center;">Welcome to MyShop! 🎉</h3>
          <p>Hi <b>${name}</b>,</p>
          <p>Your account has been created successfully!</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p>👤 Name: <b>${name}</b></p>
            <p>📧 Email: <b>${email}</b></p>
            <p>📞 Phone: <b>${phone}</b></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${clientUrl}/login"
               style="background: #0d6efd; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Login Now 🔐
            </a>
          </div>
          <hr/>
          <p style="text-align: center; color: gray;">© 2026 MyShop</p>
        </div>
      `,
    });

    res.status(201).send({
      success: true,
      message: "Successfully registered! Check your email 📧",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Register API error",
      error,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "120d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login API error",
      error,
    });
  }
};

// FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "Email not registered!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "MyShop - Password Reset OTP 🔐",
      html: `
        <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0d6efd; text-align: center;">🛒 MyShop</h2>
          <hr/>
          <h3 style="text-align: center;">Password Reset OTP</h3>
          <p>Hi <b>${user.name}</b>,</p>
          <p>Your OTP for password reset:</p>
          <div style="text-align: center; margin: 30px 0; background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h1 style="font-size: 48px; font-weight: bold; color: #0d6efd; letter-spacing: 10px;">${otp}</h1>
          </div>
          <p style="color: red;">⚠️ Valid for <b>10 minutes</b> only!</p>
          <hr/>
          <p style="text-align: center; color: gray;">© 2026 MyShop</p>
        </div>
      `,
    });

    res.status(200).send({ success: true, message: `OTP sent to ${email}! 📧` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Forgot password API error", error });
  }
};

// VERIFY OTP
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ success: false, message: "Email and OTP required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: "User not found!" });

    if (user.otp !== otp) {
      return res.status(400).send({ success: false, message: "Invalid OTP! ❌" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).send({ success: false, message: "OTP expired! Please request new OTP." });
    }

    res.status(200).send({ success: true, message: "OTP verified successfully! ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "OTP verify API error", error });
  }
};

// RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ success: false, message: "User not found!" });

    if (user.otp !== otp) {
      return res.status(400).send({ success: false, message: "Invalid OTP! ❌" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).send({ success: false, message: "OTP expired! Please request new OTP." });
    }

    user.password = await hashPassword(newPassword);
    user.otp = "";
    user.otpExpire = null;
    await user.save();

    res.status(200).send({ success: true, message: "Password reset successfully! ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Reset password API error", error });
  }
};

// ✅ NEW: user-auth check — used by Private.jsx route guard
export const userAuthController = (req, res) => {
  res.status(200).send({ ok: true });
};

// TEST CONTROLLER - Admin only
export const testController = (req, res) => {
  try {
    res.status(200).send({ success: true, message: "Admin test route working", user: req.user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Test API error", error });
  }
};

// GET ALL USERS — Admin only
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password -otp -otpExpire");
    res.status(200).send({ success: true, message: "All users fetched", total: users.length, users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching users", error });
  }
};

// UPDATE PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (password && password.length < 6) {
      return res.status(400).send({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    if (email && email !== user.email) {
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        return res.status(409).send({ success: false, message: "Email already in use by another account" });
      }
    }

    const hashedPassword = password ? await hashPassword(password) : user.password;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
          address: address || user.address,
          password: hashedPassword,
        },
        { new: true }
      )
      .select("-password -otp -otpExpire");

    res.status(200).send({ success: true, message: "Profile updated successfully!", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Update profile API error", error });
  }
};