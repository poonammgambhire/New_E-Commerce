import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserMenu from "../../components/Layout/UserMenu";

function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/auth/profile`,
        form,
        {
          headers: {
            Authorization: auth?.token, // ✅ Fix — token add kela
          },
        }
      );
      if (data.success) {
        setAuth({ ...auth, user: data.updatedUser });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: data.updatedUser })
        );
        toast.success("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    height: 31,
    fontSize: 13,
    border: "1px solid #888C8C",
    borderRadius: 3,
    boxShadow: "0 1px 2px rgba(213,217,217,.5)",
    color: "#0F1111",
    padding: "3px 7px",
    width: "100%",
  };

  const labelStyle = {
    fontWeight: 700,
    fontSize: 13,
    color: "#0F1111",
    marginBottom: 3,
    display: "block",
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

        {/* Page Title */}
        <h1
          className="mb-3"
          style={{ fontSize: 28, fontWeight: 400, color: "#0F1111" }}
        >
          Your Account
        </h1>

        <div className="row g-3">

          {/* Left: User Menu */}
          <div className="col-12 col-md-3">
            <UserMenu />
          </div>

          {/* Right: Edit Profile Form */}
          <div className="col-12 col-md-9">
            <div
              className="rounded-3 p-4"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #D5D9D9",
                boxShadow: "0 2px 4px rgba(15,17,17,.08)",
              }}
            >

              {/* Card Header */}
              <h2
                className="mb-1 pb-2"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F1111",
                  borderBottom: "1px solid #e7e7e7",
                }}
              >
                Edit Profile
              </h2>
              <p
                className="mb-4"
                style={{ fontSize: 13, color: "#565959", marginTop: 6 }}
              >
                Update your name, email, phone, address, or password below.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">

                  {/* Full Name */}
                  <div className="col-12 col-sm-6">
                    <label htmlFor="name" style={labelStyle}>Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6">
                    <label htmlFor="email" style={labelStyle}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      style={inputStyle}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-sm-6">
                    <label htmlFor="phone" style={labelStyle}>Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      style={inputStyle}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12 col-sm-6">
                    <label htmlFor="address" style={labelStyle}>Address</label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      className="form-control"
                      value={form.address}
                      onChange={handleChange}
                      required
                      autoComplete="street-address"
                      style={inputStyle}
                    />
                  </div>

                  {/* Password */}
                  <div className="col-12">
                    <label htmlFor="password" style={labelStyle}>
                      New Password{" "}
                      <span style={{ fontWeight: 400, color: "#565959" }}>
                        (leave blank to keep current)
                      </span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        style={{ ...inputStyle, paddingRight: 36 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#007185",
                          fontSize: 13,
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: "#565959", marginTop: 3, marginBottom: 0 }}>
                      Passwords must be at least 6 characters.
                    </p>
                  </div>

                </div>

                {/* Divider */}
                <hr style={{ borderColor: "#e7e7e7", margin: "20px 0 16px" }} />

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-3">

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                    style={{
                      padding: "6px 18px",
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
                    {loading ? "Saving..." : "Save changes"}
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    style={{
                      padding: "6px 18px",
                      background: "linear-gradient(to bottom, #f7f8f8, #e7e9ec)",
                      border: "1px solid #adb1b8",
                      borderBottomColor: "#8d9096",
                      borderRadius: 3,
                      color: "#0F1111",
                      fontSize: 13,
                      cursor: "pointer",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
                      outline: "none",
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;