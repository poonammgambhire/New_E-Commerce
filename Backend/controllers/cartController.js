import cartModel from "../models/cartModel.js";

// 🟢 ADD TO CART
export const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("[addToCart]", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// 🟢 GET CART
export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("products.product", "name price photo");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { products: [] },
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error("[getCart]", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// 🟢 REMOVE FROM CART
export const removeFromCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("[removeFromCart]", error);
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
};