import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .login-page {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  /* Logo */
  .login-logo {
    font-size: 1.4rem;
    font-weight: 800;
    color: #111;
    text-decoration: none;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
  .login-logo span { color: #ff9900; }
  .login-logo:hover { color: #111; text-decoration: none; }

  /* Card */
  .login-card {
    background: #fff;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 22px 26px 18px !important;
    width: 100%;
    max-width: 350px;
  }

  .login-card h2 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 18px;
  }

  /* Label */
  .login-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 4px;
  }

  /* Input */
  .login-input {
    border: 1px solid #a6a6a6 !important;
    border-radius: 3px !important;
    font-size: 0.85rem !important;
    font-family: 'Inter', sans-serif !important;
    padding: 7px 10px !important;
    transition: border-color .15s, box-shadow .15s !important;
    background: #fff;
  }
  .login-input:focus {
    border-color: #e77600 !important;
    box-shadow: 0 0 0 3px rgba(228,121,17,.5) !important;
    outline: none !important;
  }

  /* Submit button */
  .login-btn {
    background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
    color: #111 !important;
    border: 1px solid #a88734 !important;
    border-radius: 3px !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    padding: 8px !important;
    width: 100%;
    cursor: pointer;
    transition: background .15s;
    font-family: 'Inter', sans-serif;
  }
  .login-btn:hover:not(:disabled) {
    background: linear-gradient(to bottom, #f5d78e, #eeb933);
  }
  .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  /* Forgot */
  .login-forgot {
    font-size: 0.78rem;
    color: #0066c0;
    text-decoration: none;
  }
  .login-forgot:hover { color: #c45500; text-decoration: underline; }

  /* Divider */
  .login-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 16px 0;
  }
  .login-divider-line { flex: 1; height: 1px; background: #e7e7e7; }
  .login-divider span { font-size: 0.75rem; color: #767676; white-space: nowrap; }

  /* New account box */
  .login-new-box {
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 14px 16px;
    text-align: center;
    background: #f7f7f7;
  }
  .login-new-box p {
    font-size: 0.82rem; color: #111; margin: 0 0 10px;
  }

  .login-signup-btn {
    display: block;
    background: linear-gradient(to bottom, #f7f8fa, #e7e9ec);
    color: #111 !important;
    border: 1px solid #adb1b8 !important;
    border-radius: 3px !important;
    font-size: 0.82rem !important;
    font-weight: 500 !important;
    padding: 7px !important;
    text-align: center;
    text-decoration: none;
    transition: background .15s;
    font-family: 'Inter', sans-serif;
  }
  .login-signup-btn:hover {
    background: linear-gradient(to bottom, #e7e9ec, #d9dce1);
    color: #111 !important;
    text-decoration: none;
  }

  .login-terms {
    font-size: 0.7rem;
    color: #767676;
    text-align: center;
    margin-top: 14px;
    line-height: 1.5;
  }
  .login-terms a { color: #0066c0; text-decoration: none; }
  .login-terms a:hover { text-decoration: underline; color: #c45500; }
`;

function Login() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user && auth?.token) {
      navigate(auth.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [auth, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/auth/login`,
        form
      );
      if (data.success) {
        setAuth({ user: data.user, token: data.token });
        localStorage.setItem("auth", JSON.stringify({ user: data.user, token: data.token }));
        toast.success(data.message || "Login successful!");
        navigate(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
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
    <div className="login-page">
      <style>{styles}</style>

      {/* Logo */}
      <Link to="/" className="login-logo">
        🛒 My<span>Shop</span>
      </Link>

      {/* Card */}
      <div className="card login-card shadow-sm">
        <h2>Sign in</h2>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label login-label">Email or mobile phone number</label>
            <input
              type="email"
              name="email"
              className="form-control login-input"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="form-label login-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control login-input"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot password */}
          <div className="text-end mb-3 mt-1">
            <Link to="/forgot-password" className="login-forgot">
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>

        </form>

        {/* Terms */}
        <p className="login-terms mt-3">
          By signing in, you agree to MyShop's{" "}
          <Link to="/policy">Conditions of Use</Link> and{" "}
          <Link to="/policy">Privacy Notice</Link>.
        </p>

      </div>

      {/* Divider */}
      <div className="login-divider" style={{ width: "100%", maxWidth: 350 }}>
        <div className="login-divider-line" />
        <span>New to MyShop?</span>
        <div className="login-divider-line" />
      </div>

      {/* New account */}
      <div style={{ width: "100%", maxWidth: 350 }}>
        <Link to="/signup" className="btn login-signup-btn">
          Create your MyShop account
        </Link>
      </div>

    </div>
  );
}

export default Login;