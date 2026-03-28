import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserMenu from "../../components/Layout/UserMenu";

function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);

  // ✅ Orders ची संख्या fetch करा
  useEffect(() => {
    if (!auth?.token) return;
    const fetchOrderCount = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/orders/user-orders`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (data?.success) setOrderCount(data.orders.length);
      } catch (err) {
        console.error("Failed to fetch order count", err);
      }
    };
    fetchOrderCount();
  }, [auth?.token]);

  const quickLinks = [
    {
      title: "My Orders",
      desc: "Track, return, or buy things again",
      btnLabel: "View orders",
      btnStyle: "gold",
      badge: orderCount,   // ✅ Order count badge
      onClick: () => navigate("/dashboard/orders"),
    },
    {
      title: "Login & Security",
      desc: "Update your name, email, phone and address",
      btnLabel: "Edit profile",
      btnStyle: "grey",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      title: "Address Book",
      desc: "Manage your delivery addresses",
      btnLabel: "Manage address",
      btnStyle: "grey",
      onClick: () => navigate("/dashboard/address"),
    },
    {
      title: "Wishlist",
      desc: "View and manage your saved items",
      btnLabel: "View wishlist",
      btnStyle: "grey",
      onClick: () => navigate("/dashboard/wishlist"),
    },
  ];

  const goldBtn = {
    padding: "5px 14px",
    background: "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
    border: "1px solid #a88734",
    borderBottomColor: "#9c7e31",
    borderRadius: 3,
    color: "#111",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
    whiteSpace: "nowrap",
  };

  const greyBtn = {
    padding: "5px 14px",
    background: "linear-gradient(to bottom, #f7f8f8, #e7e9ec)",
    border: "1px solid #adb1b8",
    borderBottomColor: "#8d9096",
    borderRadius: 3,
    color: "#0F1111",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        minHeight: "100vh",
        paddingTop: 24,
        paddingBottom: 40,
        fontFamily: '"Amazon Ember", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 14,
        color: "#0F1111",
      }}
    >
      <div className="container">
        <h1 className="mb-3" style={{ fontSize: 28, fontWeight: 400, color: "#0F1111" }}>
          Your Account
        </h1>

        <div className="row g-3">
          {/* Left: User Menu */}
          <div className="col-12 col-md-3">
            <UserMenu />
          </div>

          {/* Right: Content */}
          <div className="col-12 col-md-9">

            {/* My Profile Card */}
            <div
              className="rounded-3 p-4 mb-3"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #D5D9D9",
                boxShadow: "0 2px 4px rgba(15,17,17,.08)",
              }}
            >
              <h2
                className="mb-3 pb-2"
                style={{
                  fontSize: 18, fontWeight: 700, color: "#0F1111",
                  borderBottom: "1px solid #e7e7e7",
                }}
              >
                My Profile
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    { label: "Name:",    value: auth?.user?.name },
                    { label: "Email:",   value: auth?.user?.email },
                    { label: "Phone:",   value: auth?.user?.phone },
                    { label: "Address:", value: auth?.user?.address },
                  ].map(({ label, value }) => (
                    <tr key={label}>
                      <td style={{ padding: "7px 0", fontWeight: 700, fontSize: 14, color: "#0F1111", width: 90, verticalAlign: "top" }}>
                        {label}
                      </td>
                      <td style={{ padding: "7px 0", fontSize: 14, color: "#0F1111" }}>
                        {value || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-2">
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  style={{ background: "none", border: "none", color: "#007185", fontSize: 13, cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >
                  Edit profile
                </button>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="row g-3">
              {quickLinks.map(({ title, desc, btnLabel, btnStyle, badge, onClick }) => (
                <div className="col-12 col-sm-6" key={title}>
                  <div
                    className="rounded-3 p-4 h-100"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #D5D9D9",
                      boxShadow: "0 2px 4px rgba(15,17,17,.08)",
                    }}
                  >
                    {/* ✅ Title + Order Count Badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F1111", margin: 0 }}>
                        {title}
                      </h3>
                      {badge > 0 && (
                        <span
                          style={{
                            background: "#ff9900",
                            color: "#111",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          {badge}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: 13, color: "#565959", marginBottom: 14, lineHeight: 1.4 }}>
                      {desc}
                    </p>
                    <button onClick={onClick} style={btnStyle === "gold" ? goldBtn : greyBtn}>
                      {btnLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;