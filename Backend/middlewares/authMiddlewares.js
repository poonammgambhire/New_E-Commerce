import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protect routes
export const requireSignIn = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing"
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT Error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid or expired token",
      error
    });
  }
};

// Admin access middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user || user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access"
      });
    }

    next(); // allow access
  } catch (error) {
    console.log("Admin Middleware Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error
    });
  }
};