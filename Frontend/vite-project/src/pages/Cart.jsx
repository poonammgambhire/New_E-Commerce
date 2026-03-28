import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    if (!auth?.token) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      setPlacing(true);

      const products = cart.map((item) => ({
        product: item._id,
        quantity: item.qty,
      }));

      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/orders/create`,
        { products, totalAmount: totalPrice },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (data.success) {
        clearCart();
        toast.success("Order placed successfully! 🎉");
        navigate("/dashboard/orders");
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order placement failed");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
        <h5 style={{ fontWeight: 700, color: "#212121" }}>Your cart is empty</h5>
        <p style={{ color: "#878787", fontSize: "0.9rem" }}>Add items to get started</p>
        <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Toaster position="top-right" />
      <div className="container py-4">
        <h5 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>
          Shopping Cart{" "}
          <span style={{ color: "#878787", fontSize: "0.85rem", fontWeight: 400 }}>
            ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </span>
        </h5>

        <div className="row g-3">
          {/* ── Cart items ── */}
          <div className="col-12 col-lg-8">
            <div className="bg-white rounded-3 p-3" style={{ border: "1px solid #e0e0e0" }}>
              {cart.map((item, idx) => (
                <div key={item._id}>
                  <div className="d-flex gap-3 align-items-start py-2">

                    {/* ✅ Image — click केल्यावर product details ला जाते */}
                    <div
                      onClick={() => navigate(`/product/${item.slug}`)}
                      style={{
                        width: 90,
                        height: 90,
                        flexShrink: 0,
                        background: "#f9f9f9",
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        cursor: "pointer",   // ✅ pointer cursor
                      }}
                    >
                      <img
                        src={
                          item.photo
                            ? `${import.meta.env.VITE_API}/uploads/${item.photo}`
                            : "https://via.placeholder.com/90x90?text=No+Image"
                        }
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/90x90?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow-1">
                      <div
                        style={{
                          fontSize: "0.67rem",
                          color: "#878787",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "2px",
                        }}
                      >
                        {item.category?.name || "Uncategorized"}
                      </div>

                      {/* ✅ Product Name — click केल्यावर product details ला जाते */}
                      <div
                        onClick={() => navigate(`/product/${item.slug}`)}
                        style={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#2874f0",      // ✅ link सारखा रंग
                          marginBottom: "4px",
                          cursor: "pointer",     // ✅ pointer cursor
                        }}
                      >
                        {item.name}
                      </div>

                      {item.shipping && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#388e3c",
                            fontWeight: 500,
                            marginBottom: "8px",
                          }}
                        >
                          FREE Delivery
                        </div>
                      )}

                      {/* Qty controls */}
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center"
                          style={{ border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}
                        >
                          <button
                            onClick={() => updateQty(item._id, item.qty - 1)}
                            style={{
                              background: "#f5f5f5",
                              border: "none",
                              padding: "2px 10px",
                              fontSize: "1rem",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              padding: "2px 12px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              minWidth: 32,
                              textAlign: "center",
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item._id, item.qty + 1)}
                            style={{
                              background: "#f5f5f5",
                              border: "none",
                              padding: "2px 10px",
                              fontSize: "1rem",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                            disabled={item.qty >= item.quantity}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item._id);
                            toast.success("Item removed");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#2874f0",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#212121",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                  {idx < cart.length - 1 && <hr className="my-1" />}
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between align-items-center mt-1">
                <button
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="btn btn-outline-danger btn-sm"
                >
                  Clear Cart
                </button>
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/")}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* ── Order summary ── */}
          <div className="col-12 col-lg-4">
            <div
              className="bg-white rounded-3 p-3"
              style={{ border: "1px solid #e0e0e0", position: "sticky", top: "1rem" }}
            >
              <h6
                style={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.78rem",
                  color: "#878787",
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </h6>

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.85rem" }}>
                <span style={{ color: "#555" }}>Subtotal ({totalItems} items)</span>
                <span style={{ fontWeight: 600 }}>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.85rem" }}>
                <span style={{ color: "#555" }}>Delivery</span>
                <span style={{ color: "#388e3c", fontWeight: 600 }}>FREE</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3" style={{ fontSize: "1rem", fontWeight: 700 }}>
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <button
                className="btn btn-warning w-100 fw-bold"
                style={{ fontSize: "0.9rem", padding: "10px" }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Placing Order...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              {!auth?.token && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#878787",
                    textAlign: "center",
                    marginTop: "8px",
                    marginBottom: 0,
                  }}
                >
                  Please{" "}
                  <span
                    style={{ color: "#2874f0", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => navigate("/login")}
                  >
                    login
                  </span>{" "}
                  to place your order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;