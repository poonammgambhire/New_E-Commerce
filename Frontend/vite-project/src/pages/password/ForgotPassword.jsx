import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/auth/forgot-password`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/verify-otp", { state: { email } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Password Assistance | MyShop</title>
      </Helmet>

      {/* ── Top Navbar ── */}
      <nav
        className="navbar"
        style={{ backgroundColor: "#131921", padding: "10px 20px" }}
      >
        <a
          className="navbar-brand"
          href="/"
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: -1,
            textDecoration: "none",
          }}
        >
          🛒 My<span style={{ color: "#FF9900" }}>Shop</span>
        </a>
      </nav>

      {/* ── Page Body ── */}
      <div
        style={{
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 56px)",
          paddingTop: 28,
          paddingBottom: 40,
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-6 col-lg-4">

              {/* ── Main Card ── */}
              <div
                className="rounded-3 p-4"
                style={{
                  border: "1px solid #D5D9D9",
                  boxShadow:
                    "0 2px 4px rgba(15,17,17,.15), 0 4px 16px rgba(15,17,17,.05)",
                  backgroundColor: "#fff",
                }}
              >
                {/* Heading */}
                <h1
                  className="mb-1"
                  style={{ fontSize: 28, fontWeight: 400, color: "#0F1111" }}
                >
                  Password assistance
                </h1>
                <p
                  className="mb-3"
                  style={{ fontSize: 13, color: "#0F1111", lineHeight: 1.5 }}
                >
                  Enter the email address associated with your MyShop account.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="fpEmail"
                      className="form-label mb-1"
                      style={{ fontWeight: 700, fontSize: 13, color: "#0F1111" }}
                    >
                      Email address
                    </label>
                    <input
                      id="fpEmail"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      style={{
                        height: 31,
                        fontSize: 13,
                        border: "1px solid #888C8C",
                        borderRadius: 3,
                        boxShadow: "0 1px 2px rgba(213,217,217,.5)",
                        color: "#0F1111",
                        padding: "3px 7px",
                      }}
                    />
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      padding: "6px 10px",
                      background: loading
                        ? "#f5d78e"
                        : "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
                      border: "1px solid #a88734",
                      borderBottomColor: "#9c7e31",
                      borderRadius: 3,
                      color: "#111",
                      fontSize: 13,
                      fontWeight: 400,
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
                      outline: "none",
                    }}
                  >
                    {loading && (
                      <span
                        className="spinner-border"
                        role="status"
                        style={{ width: 12, height: 12, borderWidth: 2 }}
                      />
                    )}
                    {loading ? "Sending OTP..." : "Continue"}
                  </button>

                </form>

                {/* Divider */}
                <hr style={{ borderColor: "#e7e7e7", margin: "14px 0" }} />

                {/* Back to Sign In */}
                <p className="mb-0" style={{ fontSize: 13 }}>
                  <Link
                    to="/login"
                    style={{ color: "#007185", textDecoration: "none" }}
                  >
                    ‹ Back to Sign In
                  </Link>
                </p>
              </div>

              {/* ── New to MyShop ── */}
              <div
                className="mt-4 pt-3 text-center"
                style={{ borderTop: "1px solid #e7e7e7" }}
              >
                <p className="mb-2" style={{ fontSize: 13, color: "#0F1111" }}>
                  New to MyShop?
                </p>
                <Link
                  to="/signup"
                  className="w-100 d-block"
                  style={{
                    padding: "6px 10px",
                    background: "linear-gradient(to bottom, #f7f8f8, #e7e9ec)",
                    border: "1px solid #adb1b8",
                    borderBottomColor: "#8d9096",
                    borderRadius: 3,
                    color: "#0F1111",
                    fontSize: 13,
                    textDecoration: "none",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
                  }}
                >
                  Create your MyShop account
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "linear-gradient(to bottom, #f2f2f2, #e6e6e6)",
          borderTop: "1px solid #ddd",
          padding: "14px 0 10px",
          textAlign: "center",
        }}
      >
        <div className="mb-1">
          {["Conditions of Use", "Privacy Notice", "Help"].map((item, i) => (
            <a
              key={i}
              href="#"
              style={{
                color: "#007185",
                fontSize: 12,
                margin: "0 8px",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#767676", margin: 0 }}>
          © 2024 MyShop, Inc. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default ForgotPassword;