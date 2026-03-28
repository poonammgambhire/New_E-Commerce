import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "processing":  return { bg: "#fff8e1", color: "#f57f17" };
    case "shipped":     return { bg: "#e3f2fd", color: "#1565c0" };
    case "delivered":   return { bg: "#e8f5e9", color: "#2e7d32" };
    case "cancelled":   return { bg: "#fce4ec", color: "#c62828" };
    default:            return { bg: "#f3f3f3", color: "#555" };
  }
};

// Inline SVG fallback — no external request needed
const NoImage = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" fill="#f0f0f0" />
    <rect x="14" y="14" width="24" height="18" rx="2" fill="#d0d0d0" />
    <circle cx="20" cy="20" r="3" fill="#b0b0b0" />
    <polygon points="14,32 22,22 28,28 34,20 38,32" fill="#c0c0c0" />
    <text x="26" y="44" textAnchor="middle" fontSize="7" fill="#999">No Image</text>
  </svg>
);

const Orders = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/orders/user-orders`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (data?.success) setOrders(data.orders);
        else toast.error(data.message || "Failed to fetch orders");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [auth?.token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: "#ff9900" }} role="status" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container py-5 text-center">
        <Toaster position="top-right" />
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
        <h5 style={{ fontWeight: 700, color: "#212121" }}>No orders yet</h5>
        <p style={{ color: "#878787", fontSize: "0.9rem" }}>
          You haven't placed any orders yet.
        </p>
        <button className="btn btn-warning fw-bold mt-2" onClick={() => navigate("/")}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Toaster position="top-right" />
      <div className="container py-4">
        <h5 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>
          My Orders{" "}
          <span style={{ color: "#878787", fontSize: "0.85rem", fontWeight: 400 }}>
            ({orders.length} order{orders.length !== 1 ? "s" : ""})
          </span>
        </h5>

        {orders.map((order) => {
          const sc = statusColor(order.status);
          return (
            <div
              key={order._id}
              className="bg-white rounded-3 mb-3"
              style={{ border: "1px solid #e0e0e0", overflow: "hidden" }}
            >
              {/* Order Header */}
              <div
                style={{
                  background: "#f7f7f7",
                  borderBottom: "1px solid #e0e0e0",
                  padding: "10px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "#555" }}>
                  <span style={{ fontWeight: 700, color: "#111" }}>ORDER ID: </span>
                  <span style={{ fontFamily: "monospace" }}>{order._id}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.78rem", color: "#555" }}>
                    <span style={{ fontWeight: 700, color: "#111" }}>Total: </span>
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                  <span
                    style={{
                      background: sc.bg,
                      color: sc.color,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Products List */}
              <div style={{ padding: "12px 16px" }}>
                {order.products?.map((p, index) => (
                  <div
                    key={p.product?._id ?? `${order._id}-item-${index}`}
                    onClick={() => navigate(`/product/${p.product?.slug}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: "pointer",
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: 60, height: 60, flexShrink: 0,
                        background: "#f9f9f9", border: "1px solid #eee",
                        borderRadius: 6, overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {p.product?.photo ? (
                        <img
                          src={`${import.meta.env.VITE_API}${p.product.photo}`}
                          alt={p.product?.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector("svg")?.style.setProperty("display", "block");
                          }}
                        />
                      ) : (
                        <NoImage />
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#2874f0" }}>
                        {p.product?.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#878787", marginTop: 2 }}>
                        Qty: {p.quantity} × ₹{p.product?.price?.toLocaleString()}
                      </div>
                    </div>

                    {/* Line Total */}
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#212121", whiteSpace: "nowrap" }}>
                      ₹{(p.product?.price * p.quantity)?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #f0f0f0",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#878787" }}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : ""}
                </span>
                <button
                  className="btn btn-outline-warning btn-sm fw-bold"
                  onClick={() => navigate("/")}
                >
                  Buy Again
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;