import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
} from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/auth/register`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
        }
      );
      if (data.success) {
        toast.success(data.message || "Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Amazon</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ember+Display:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        body {
          background-color: #fff;
          font-family: "Amazon Ember", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 14px;
          color: #0F1111;
        }

        /* ── Top Nav ── */
        .amz-navbar {
          background-color: #131921;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .amz-logo {
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -1px;
          text-decoration: none;
        }
        .amz-logo span { color: #FF9900; }

        /* ── Page wrapper ── */
        .amz-page {
          background: #fff;
          min-height: calc(100vh - 56px);
          padding: 24px 0 40px;
        }

        /* ── Card ── */
        .amz-card {
          width: 100%;
          max-width: 350px;
          margin: 0 auto;
          padding: 22px 26px 24px;
          border: 1px solid #D5D9D9;
          border-radius: 8px;
          background: #fff;
        }

        .amz-card h1 {
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 18px;
          color: #0F1111;
        }

        /* ── Form Controls ── */
        .amz-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 3px;
          color: #0F1111;
        }

        .amz-input {
          width: 100%;
          height: 31px;
          padding: 3px 7px;
          font-size: 13px;
          color: #0F1111;
          background: #fff;
          border: 1px solid #888C8C;
          border-radius: 3px;
          outline: none;
          box-shadow: 0 1px 2px rgba(213,217,217,.5);
          transition: border-color .15s, box-shadow .15s;
        }
        .amz-input:focus {
          border-color: #E77600;
          box-shadow: 0 0 0 3px rgba(228,121,17,.5);
        }

        .amz-input-wrap {
          position: relative;
        }
        .amz-input-wrap .amz-input { padding-right: 36px; }
        .amz-eye-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #007185;
          font-size: 13px;
          padding: 0;
          line-height: 1;
        }
        .amz-eye-btn:hover { color: #c7511f; }

        /* ── Primary Button ── */
        .amz-btn-primary {
          display: block;
          width: 100%;
          padding: 6px 10px;
          background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
          border: 1px solid #a88734;
          border-bottom-color: #9c7e31;
          border-radius: 3px;
          color: #111;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          text-align: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.6);
          transition: background .1s;
        }
        .amz-btn-primary:hover {
          background: linear-gradient(to bottom, #f5d78e, #eeb933);
          border-color: #a88734;
        }
        .amz-btn-primary:active {
          background: linear-gradient(to bottom, #f0c14b, #f7dfa5);
          box-shadow: inset 0 1px 3px rgba(0,0,0,.2);
        }

        /* ── Divider / footer text ── */
        .amz-divider {
          border: none;
          border-top: 1px solid #e7e7e7;
          margin: 14px 0 14px;
        }

        .amz-terms {
          font-size: 12px;
          color: #555;
          line-height: 1.5;
        }
        .amz-terms a, .amz-link {
          color: #007185;
          text-decoration: none;
        }
        .amz-terms a:hover, .amz-link:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .amz-already {
          font-size: 13px;
          color: #0F1111;
        }
        .amz-already a {
          color: #007185;
          text-decoration: none;
        }
        .amz-already a:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .amz-separator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 14px 0;
          font-size: 12px;
          color: #767676;
        }
        .amz-separator::before,
        .amz-separator::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #d5d9d9;
        }

        /* ── Footer bar ── */
        .amz-footer-bar {
          background: linear-gradient(to bottom, #f2f2f2, #e6e6e6);
          border-top: 1px solid #ddd;
          padding: 14px 0 10px;
          text-align: center;
        }
        .amz-footer-links a {
          color: #007185;
          font-size: 12px;
          margin: 0 8px;
          text-decoration: none;
        }
        .amz-footer-links a:hover { text-decoration: underline; color: #c7511f; }
        .amz-footer-copy { font-size: 12px; color: #767676; margin-top: 6px; }

        /* ── Checkbox ── */
        .amz-check-label {
          font-size: 13px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          color: #0F1111;
        }
        .amz-check-label input[type="checkbox"] {
          margin-top: 2px;
          accent-color: #FF9900;
          flex-shrink: 0;
        }

        .field-hint {
          font-size: 11px;
          color: #565959;
          margin-top: 2px;
        }

        .amz-card-shadow {
          box-shadow: 0 2px 4px rgba(15,17,17,.15), 0 4px 16px rgba(15,17,17,.05);
        }
      `}</style>

      {/* Navbar */}
      <nav className="amz-navbar">
        <a href="/" className="amz-logo">
          amazon<span>.in</span>
        </a>
      </nav>

      {/* Page */}
      <div className="amz-page">
        <div className="amz-card amz-card-shadow">

          <h1>Create account</h1>

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-2">
              <label className="amz-label" htmlFor="name">Your name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="amz-input"
                placeholder="First and last name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            {/* Mobile number */}
            <div className="mb-2">
              <label className="amz-label" htmlFor="phone">Mobile number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className="amz-input"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
              <p className="field-hint">May be used to assist account recovery</p>
            </div>

            {/* Email */}
            <div className="mb-2">
              <label className="amz-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="amz-input"
                placeholder=""
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            {/* Address */}
            <div className="mb-2">
              <label className="amz-label" htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                name="address"
                className="amz-input"
                placeholder="Street, City, PIN"
                value={form.address}
                onChange={handleChange}
                required
                autoComplete="street-address"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="amz-label" htmlFor="password">Password</label>
              <div className="amz-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="amz-input"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="amz-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="field-hint">Passwords must be at least 6 characters.</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="amz-label" htmlFor="confirmPassword">Re-enter password</label>
              <div className="amz-input-wrap">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="amz-input"
                  placeholder=""
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="amz-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="mb-3">
              <label className="amz-check-label">
                <input type="checkbox" required />
                <span>
                  I agree to Amazon's{" "}
                  <Link to="/policy" className="amz-link">Conditions of Use</Link>
                  {" "}&amp;{" "}
                  <Link to="/policy" className="amz-link">Privacy Notice</Link>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="amz-btn-primary">
              Continue
            </button>

          </form>

          {/* Terms note */}
          <p className="amz-terms mt-2">
            By creating an account, you agree to Amazon's{" "}
            <Link to="/policy">Conditions of Use</Link> and{" "}
            <Link to="/policy">Privacy Notice</Link>.
          </p>

          <hr className="amz-divider" />

          {/* Already have account */}
          <p className="amz-already mb-0">
            Already have an account?{" "}
            <Link to="/login">Sign in <span style={{ fontSize: 11 }}>›</span></Link>
          </p>

          <div className="amz-separator mt-3">Buying for work?</div>

          <a href="#" className="amz-link d-block text-center" style={{ fontSize: 13 }}>
            Create a free business account
          </a>

        </div>
      </div>

      {/* Footer */}
      <footer className="amz-footer-bar">
        <div className="amz-footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p className="amz-footer-copy">© 1996–2024, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </>
  );
}

export default SignUp;