import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .amz-footer { font-family: 'Inter', sans-serif; }

  /* Back to top */
  .amz-footer-top-btn {
    background: #37475a;
    color: #fff;
    text-align: center;
    padding: 14px;
    font-size: 0.83rem;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
    border: none;
    width: 100%;
    font-family: 'Inter', sans-serif;
    display: block;
    text-decoration: none;
  }
  .amz-footer-top-btn:hover { background: #485769; color: #fff; text-decoration: none; }

  /* Main footer */
  .amz-footer-main {
    background: #232f3e;
    padding: 36px 0 24px;
    color: #fff;
  }
  .amz-footer-col-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }
  .amz-footer-link {
    display: block;
    font-size: 0.8rem;
    color: #adb5bd;
    text-decoration: none;
    margin-bottom: 7px;
    transition: color .12s;
    font-family: 'Inter', sans-serif;
  }
  .amz-footer-link:hover { color: #fff; text-decoration: none; }

  /* Divider */
  .amz-footer-divider {
    border-color: #3a4553 !important;
    margin: 24px 0 20px !important;
  }

  /* Bottom bar */
  .amz-footer-bottom {
    background: #131921;
    padding: 16px 0;
    color: #adb5bd;
  }
  .amz-footer-logo {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: -0.02em;
  }
  .amz-footer-logo span { color: #ff9900; }
  .amz-footer-logo:hover { color: #fff; text-decoration: none; }

  .amz-footer-bottom-link {
    font-size: 0.75rem;
    color: #adb5bd;
    text-decoration: none;
    margin: 0 8px;
    transition: color .12s;
  }
  .amz-footer-bottom-link:hover { color: #fff; text-decoration: none; }

  .amz-footer-copyright {
    font-size: 0.75rem;
    color: #adb5bd;
    text-align: center;
    margin-top: 8px;
  }

  /* Social icons */
  .amz-social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #37475a;
    color: #adb5bd;
    text-decoration: none;
    margin-right: 8px;
    transition: background .15s, color .15s;
    font-size: 0.8rem;
  }
  .amz-social-btn:hover { background: #ff9900; color: #111; }

  /* Payment badges */
  .amz-payment-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background: #37475a;
    border-radius: 3px;
    font-size: 0.68rem;
    font-weight: 700;
    color: #fff;
    margin-right: 6px;
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }

  @media (max-width: 768px) {
    .amz-footer-main .row > div { margin-bottom: 24px; }
    .amz-footer-bottom .d-flex { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

const footerLinks = {
  "Get to Know Us": [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/policy" },
    { label: "Terms of Use", to: "/terms" },
  ],
  "Shop With Us": [
    { label: "All Products", to: "/" },
    { label: "Categories", to: "/categories" },
    { label: "Today's Deals", to: "/" },
    { label: "New Arrivals", to: "/" },
  ],
  "Let Us Help You": [
    { label: "Your Account", to: "/dashboard" },
    { label: "Your Orders", to: "/dashboard/orders" },
    { label: "Shipping Info", to: "/policy" },
    { label: "Returns & Refunds", to: "/policy" },
  ],
};

const payments = ["Visa", "Mastercard", "UPI", "NetBanking", "COD", "Paytm"];

function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="amz-footer mt-auto">
      <style>{footerStyles}</style>

      {/* Back to top */}
      <button className="amz-footer-top-btn" onClick={scrollTop}>
        Back to top
      </button>

      {/* Main links */}
      <div className="amz-footer-main">
        <div className="container">
          <div className="row">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div className="col-6 col-md-3" key={title}>
                <p className="amz-footer-col-title">{title}</p>
                {links.map((l) => (
                  <Link key={l.label} className="amz-footer-link" to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Connect with us */}
            <div className="col-6 col-md-3">
              <p className="amz-footer-col-title">Connect with Us</p>
              <div style={{ marginBottom: 16 }}>
                <a className="amz-social-btn" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a className="amz-social-btn" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a className="amz-social-btn" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a className="amz-social-btn" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
              <p className="amz-footer-col-title" style={{ marginTop: 8 }}>We Accept</p>
              <div>
                {payments.map((p) => (
                  <span key={p} className="amz-payment-badge">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <hr className="amz-footer-divider" />

          {/* Contact info row */}
          <div className="row">
            <div className="col-12 col-md-6 mb-2">
              <p style={{ fontSize: "0.78rem", color: "#adb5bd", marginBottom: 4 }}>
                📧 <a href="mailto:shop@myshop.com" className="amz-footer-link d-inline" style={{ fontSize: "0.78rem" }}>shop@myshop.com</a>
                &nbsp;&nbsp;
                📞 <span style={{ color: "#adb5bd" }}>+91 98765 43210</span>
              </p>
            </div>
            <div className="col-12 col-md-6 text-md-end">
              <p style={{ fontSize: "0.78rem", color: "#adb5bd", marginBottom: 4 }}>
                🕐 Mon – Sat, 9 AM – 6 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="amz-footer-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <Link to="/" className="amz-footer-logo">
              🛒 My<span>Shop</span>
            </Link>
            <div className="d-flex flex-wrap justify-content-center">
              <Link to="/policy" className="amz-footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="amz-footer-bottom-link">Terms of Use</Link>
              <Link to="/contact" className="amz-footer-bottom-link">Help</Link>
              <Link to="/about" className="amz-footer-bottom-link">About</Link>
            </div>
          </div>
          <p className="amz-footer-copyright">
            © {new Date().getFullYear()} MyShop. All rights reserved. Made with ❤️ in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;