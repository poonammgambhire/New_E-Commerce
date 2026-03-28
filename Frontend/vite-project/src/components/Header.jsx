import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaShoppingCart, FaSearch, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .amz-header { font-family: 'Inter', sans-serif; }
  .amz-topbar { background: #131921 !important; padding: 8px 0; }

  .amz-logo {
    color: #fff !important; font-size: 1.25rem;
    font-weight: 800; text-decoration: none;
    letter-spacing: -0.02em; white-space: nowrap;
  }
  .amz-logo span { color: #ff9900; }
  .amz-logo:hover { color: #fff !important; text-decoration: none; }

  /* Search Bar */
  .amz-search-wrap { flex: 1; max-width: 860px; position: relative; }
  .amz-search-wrap .input-group { height: 40px; flex-wrap: nowrap; align-items: stretch; }
  .amz-search-select {
    background: #f3f3f3; color: #111; border: none;
    border-radius: 4px 0 0 4px !important;
    font-size: 0.72rem; font-weight: 500; padding: 0 6px;
    cursor: pointer; outline: none;
    border-right: 1px solid #cdcdcd !important;
    min-width: 60px; max-width: 60px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    height: 100% !important; flex-shrink: 0;
  }
  .amz-search-input {
    border: none !important; outline: none !important;
    font-size: 0.95rem !important; font-family: 'Inter', sans-serif !important;
    box-shadow: none !important; flex: 1 !important;
    height: 100% !important; border-radius: 0 !important; min-width: 0;
  }
  .amz-search-btn {
    background: #ff9900 !important; border: none !important;
    color: #111 !important; font-weight: 700;
    border-radius: 0 4px 4px 0 !important; padding: 0 18px;
    height: 100% !important; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }
  .amz-search-btn:hover { background: #e68900 !important; }

  /* Live Search Suggestions */
  .amz-suggestions {
    position: absolute; top: calc(100% + 2px); left: 0; right: 0;
    background: #fff; border: 1px solid #ddd; border-radius: 4px;
    box-shadow: 0 6px 24px rgba(0,0,0,.15); z-index: 99999;
    max-height: 320px; overflow-y: auto;
  }
  .amz-suggestion-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px; cursor: pointer; transition: background .1s;
    color: #111; border-bottom: 1px solid #f5f5f5;
  }
  .amz-suggestion-item:last-child { border-bottom: none; }
  .amz-suggestion-item:hover { background: #fff8ee; color: #c7511f; }
  .amz-suggestion-img {
    width: 36px; height: 36px; object-fit: contain; border-radius: 3px;
    border: 1px solid #eee; flex-shrink: 0; background: #f8f8f8;
  }
  .amz-suggestion-info { flex: 1; min-width: 0; }
  .amz-suggestion-name {
    font-size: 0.83rem; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .amz-suggestion-cat { font-size: 0.7rem; color: #888; margin-top: 1px; }
  .amz-suggestion-price { font-size: 0.82rem; font-weight: 700; color: #111; white-space: nowrap; }
  .amz-suggestion-loading { padding: 14px; text-align: center; font-size: 0.82rem; color: #888; }
  .amz-suggestion-empty { padding: 14px; text-align: center; font-size: 0.82rem; color: #aaa; }
  .amz-suggestion-header {
    padding: 6px 14px 4px; font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em;
    color: #888; background: #fafafa; border-bottom: 1px solid #f0f0f0;
  }

  /* Delivery bar */
  .amz-delivery-bar { background: #232f3e; padding: 5px 0; border-top: 1px solid #3a4553; }
  .amz-delivery-inner {
    display: flex; align-items: center; gap: 6px;
    cursor: pointer; padding: 3px 8px; border-radius: 3px;
    border: 1px solid transparent; transition: border-color .12s;
    color: #fff; text-decoration: none; width: fit-content;
  }
  .amz-delivery-inner:hover { border-color: #fff; color: #fff; text-decoration: none; }
  .amz-delivery-icon { color: #ff9900; font-size: 0.95rem; flex-shrink: 0; margin-top: 1px; }
  .amz-delivery-text { display: flex; flex-direction: column; line-height: 1.3; }
  .amz-delivery-line1 { font-size: 0.68rem; color: #ccc; }
  .amz-delivery-line2 { font-size: 0.8rem; font-weight: 700; color: #fff; }

  /* Location modal */
  .amz-location-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 99999;
    display: flex; align-items: flex-start; justify-content: center; padding-top: 80px;
  }
  .amz-location-modal {
    background: #fff; border-radius: 8px; padding: 24px; width: 340px;
    box-shadow: 0 8px 32px rgba(0,0,0,.3); position: relative;
  }
  .amz-location-modal h6 { font-size: 1rem; font-weight: 700; margin-bottom: 14px; color: #111; }
  .amz-location-close {
    position: absolute; top: 12px; right: 16px;
    background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #555; line-height: 1;
  }
  .amz-location-input {
    width: 100%; padding: 8px 10px; font-size: 0.87rem;
    border: 1px solid #a0a0a0; border-radius: 4px;
    outline: none; font-family: 'Inter', sans-serif; margin-bottom: 10px;
  }
  .amz-location-input:focus { border-color: #ff9900; box-shadow: 0 0 0 2px rgba(255,153,0,.25); }
  .amz-location-apply {
    width: 100%; padding: 8px; background: #ff9900; border: none;
    border-radius: 4px; font-weight: 700; font-size: 0.87rem;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: background .15s;
  }
  .amz-location-apply:hover { background: #e68900; }
  .amz-location-divider {
    text-align: center; font-size: 0.78rem; color: #888; margin: 8px 0; position: relative;
  }
  .amz-location-divider::before, .amz-location-divider::after {
    content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #ddd;
  }
  .amz-location-divider::before { left: 0; }
  .amz-location-divider::after { right: 0; }
  .amz-location-detect {
    width: 100%; padding: 8px; background: #fff;
    border: 1px solid #a0a0a0; border-radius: 4px;
    font-size: 0.85rem; font-weight: 600; cursor: pointer;
    font-family: 'Inter', sans-serif; color: #0066c0;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background .12s;
  }
  .amz-location-detect:hover { background: #f3f3f3; }

  /* Account button */
  .amz-account-btn {
    display: flex; flex-direction: column;
    background: transparent !important; border: 1px solid transparent !important;
    color: #fff !important; padding: 4px 10px; border-radius: 3px;
    text-align: left; transition: border-color .12s; font-family: 'Inter', sans-serif;
  }
  .amz-account-btn:hover, .amz-account-btn:focus, .amz-account-btn.show {
    border-color: #fff !important; background: transparent !important;
    color: #fff !important; box-shadow: none !important;
  }
  .amz-line1 { font-size: 0.62rem; color: #ccc; line-height: 1.3; }
  .amz-line2 { font-size: 0.8rem; font-weight: 700; color: #fff; line-height: 1.3; }

  .amz-dropdown-menu {
    border: 1px solid #ddd !important; border-radius: 4px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,.15) !important;
    padding: 6px 0 !important; min-width: 180px;
  }
  .amz-dropdown-item {
    font-size: 0.83rem !important; padding: 10px 16px !important;
    color: #111 !important; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; gap: 8px;
  }
  .amz-dropdown-item:hover { background: #f3f3f3 !important; color: #c7511f !important; }
  .amz-dropdown-item.danger { color: #c0392b !important; font-weight: 600 !important; }
  .amz-dropdown-item.danger:hover { background: #fff5f5 !important; color: #c0392b !important; }

  /* Cart */
  .amz-cart-btn {
    display: flex; align-items: center; gap: 6px;
    color: #fff !important; text-decoration: none !important;
    padding: 6px 10px; border-radius: 3px;
    border: 1px solid transparent; transition: border-color .12s; position: relative;
  }
  .amz-cart-btn:hover { border-color: #fff; }
  .amz-cart-count {
    position: absolute; top: -2px; right: 20px;
    background: #ff9900; color: #111; font-size: 0.68rem; font-weight: 800;
    min-width: 18px; height: 18px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; padding: 0 3px;
  }
  .amz-cart-label { font-size: 0.82rem; font-weight: 700; }

  /* Login / Signup */
  .amz-login-btn {
    background: transparent !important; border: 1px solid transparent !important;
    color: #fff !important; padding: 4px 10px; border-radius: 3px;
    text-align: left; font-family: 'Inter', sans-serif; text-decoration: none;
    transition: border-color .12s; display: flex; flex-direction: column;
  }
  .amz-login-btn:hover { border-color: #fff !important; color: #fff !important; }
  .amz-signup-btn {
    background: #ff9900 !important; color: #111 !important;
    border: none !important; padding: 7px 14px; border-radius: 3px;
    font-size: 0.82rem; font-weight: 700; font-family: 'Inter', sans-serif;
    text-decoration: none; transition: background .15s; white-space: nowrap;
  }
  .amz-signup-btn:hover { background: #e68900 !important; color: #111 !important; }

  /* ── Navbar ── */
  .amz-navbar { background: #232f3e !important; padding: 0 !important; }

  /* Nav links: underline on hover, NO box */
  .amz-nav-link {
    color: #fff !important;
    font-size: 0.82rem !important;
    font-weight: 500 !important;
    padding: 8px 10px !important;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
    text-decoration: none !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    border-radius: 0 !important;
    transition: border-color .15s !important;
    display: inline-block;
  }
  .amz-nav-link:hover,
  .amz-nav-link.active {
    color: #fff !important;
    text-decoration: none !important;
    border-bottom: 2px solid #fff !important;
  }

  /* Category toggle: underline on hover, NO box */
  .amz-cat-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    color: #fff; font-size: 0.82rem; font-weight: 500;
    padding: 8px 10px;
    background: transparent; border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0; cursor: pointer;
    font-family: 'Inter', sans-serif; white-space: nowrap;
    transition: border-color .15s; line-height: 1;
  }
  .amz-cat-toggle:hover,
  .amz-cat-toggle.open { border-bottom: 2px solid #fff; }
  .amz-cat-chevron { transition: transform .2s ease; }
  .amz-cat-toggle.open .amz-cat-chevron { transform: rotate(180deg); }

  /* Category portal menu */
  .amz-cat-portal-menu {
    position: fixed; z-index: 999999;
    background: #fff; border: 1px solid #ddd; border-radius: 4px;
    box-shadow: 0 6px 24px rgba(0,0,0,.18);
    padding: 6px 0; min-width: 210px;
    max-height: 360px; overflow-y: auto;
  }
  .amz-cat-item {
    display: block; font-size: 0.83rem; padding: 9px 16px;
    color: #111 !important; font-family: 'Inter', sans-serif;
    text-decoration: none !important; white-space: nowrap;
    transition: background .1s; cursor: pointer;
  }
  .amz-cat-item:hover { background: #fff8ee !important; color: #c7511f !important; }
  .amz-cat-item.all-cat { font-weight: 600; border-bottom: 1px solid #f0f0f0; }

  .amz-cat-skeleton {
    height: 14px; background: #ebebeb; border-radius: 3px; margin: 9px 16px;
    animation: shimmer 1.2s infinite ease-in-out;
  }
  @keyframes shimmer {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.35; }
  }

  @media (max-width: 768px) {
    .amz-search-select { display: none; }
    .amz-delivery-bar .container-fluid { justify-content: center; }
  }
`;

const API = import.meta.env.VITE_API || "http://localhost:5000";

/* ── Category Portal Menu ── */
function CategoryPortalMenu({ btnRef, open, onEnter, onLeave, onClose, categories, catLoading }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!btnRef.current) return;

    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom, left: r.left });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, btnRef]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Invisible hover bridge — covers the 2px gap between button bottom and menu top */}
      <div
        style={{
          position: "fixed",
          top: pos.top - 4,
          left: pos.left,
          width: 220,
          height: 12,
          zIndex: 999998,
          background: "transparent",
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      />
      {/* The actual dropdown menu */}
      <div
        className="amz-cat-portal-menu"
        style={{ top: pos.top + 2, left: pos.left }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {catLoading ? (
          [80, 130, 105, 150].map((w, i) => (
            <div key={i} className="amz-cat-skeleton" style={{ width: w }} />
          ))
        ) : categories.length > 0 ? (
          <>
            <Link className="amz-cat-item all-cat" to="/categories" onClick={onClose}>
               All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                className="amz-cat-item"
                to={`/category/${cat.slug}`}
                onClick={onClose}
              >
                {cat.name}
              </Link>
            ))}
          </>
        ) : (
          <span className="amz-cat-item" style={{ color: "#999", cursor: "default" }}>
            No categories found
          </span>
        )}
      </div>
    </>,
    document.body
  );
}

/* ── Location Modal ── */
function LocationModal({ onClose, onApply, currentLocation }) {
  const [pincode, setPincode] = useState(currentLocation || "");

  const handleDetect = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city || data.address?.town ||
            data.address?.village || data.address?.state || "Your Location";
          onApply(city); onClose();
        } catch { toast.error("Could not fetch location name."); }
      },
      () => toast.error("Location access denied.")
    );
  };

  const handleApply = () => {
    if (pincode.trim()) { onApply(pincode.trim()); onClose(); }
  };

  return createPortal(
    <div className="amz-location-modal-overlay" onClick={onClose}>
      <div className="amz-location-modal" onClick={(e) => e.stopPropagation()}>
        <button className="amz-location-close" onClick={onClose}>✕</button>
        <h6>Choose your location</h6>
        <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: 12 }}>
          Delivery options and speeds may vary for different locations.
        </p>
        <input
          className="amz-location-input"
          type="text"
          placeholder="Enter pincode or city name"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          autoFocus
        />
        <button className="amz-location-apply" onClick={handleApply}>Apply</button>
        <div className="amz-location-divider">or</div>
        <button className="amz-location-detect" onClick={handleDetect}>
          <FaMapMarkerAlt size={13} /> Use my current location
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ── Header ── */
function Header() {
  const { auth, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate         = useNavigate();

  const [search, setSearch]                   = useState("");
  const [suggestions, setSuggestions]         = useState([]);
  const [sugLoading, setSugLoading]           = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories]           = useState([]);
  const [catLoading, setCatLoading]           = useState(true);
  const [catOpen, setCatOpen]                 = useState(false);
  const [locationModal, setLocationModal]     = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(
    () => localStorage.getItem("deliveryLocation") || "India"
  );

  const btnRef      = useRef(null);
  const searchRef   = useRef(null);
  const debounceRef = useRef(null);
  const closeTimer  = useRef(null);   // delay close so mouse can reach the menu

  // Fetch categories
  useEffect(() => {
    axios.get("/api/v1/category/get-category")
      .then(({ data }) => {
        if (data.success) setCategories(Array.isArray(data.categories) ? data.categories : []);
      })
      .catch((e) => console.error("Categories fetch failed:", e))
      .finally(() => setCatLoading(false));
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!search.trim() || search.trim().length < 2) {
      setSuggestions([]); setShowSuggestions(false); return;
    }
    debounceRef.current = setTimeout(async () => {
      setSugLoading(true);
      try {
        const { data } = await axios.get(`/api/v1/product/search/${search.trim()}`);
        if (data.success) {
          setSuggestions(data.products?.slice(0, 8) || []);
          setShowSuggestions(true);
        }
      } catch { setSuggestions([]); }
      finally { setSugLoading(false); }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Hover handlers with 150ms delay so mouse can travel button → menu without closing
  const handleCatEnter = () => {
    clearTimeout(closeTimer.current);
    setCatOpen(true);
  };
  const handleCatLeave = () => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 150);
  };

  const handleLogout = () => {
    logout(); toast.success("Logged out successfully!"); navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch(""); setSuggestions([]); setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearch(""); setSuggestions([]); setShowSuggestions(false);
    navigate(`/product/${product.slug}`);
  };

  const handleApplyLocation = (loc) => {
    setDeliveryLocation(loc);
    localStorage.setItem("deliveryLocation", loc);
    toast.success(`Delivery location set to: ${loc}`);
  };

  return (
    <div className="amz-header">
      <style>{styles}</style>

      {/* ── Top Bar ── */}
      <nav className="navbar amz-topbar">
        <div className="container-fluid px-3 px-lg-4 d-flex align-items-center gap-3">

          <Link to="/" className="amz-logo me-2">🛒 My<span>Shop</span></Link>

          {/* Delivery — desktop */}
          <div
            className="amz-delivery-inner d-none d-lg-flex me-1"
            onClick={() => setLocationModal(true)}
            role="button"
          >
            <FaMapMarkerAlt className="amz-delivery-icon" />
            <div className="amz-delivery-text">
              <span className="amz-delivery-line1">Deliver to</span>
              <span className="amz-delivery-line2">
                {deliveryLocation.length > 18 ? deliveryLocation.slice(0, 16) + "…" : deliveryLocation}
              </span>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <div className="amz-search-wrap d-none d-md-flex" ref={searchRef}>
            <form className="w-100" onSubmit={handleSearch}>
              <div className="input-group">
                <select className="amz-search-select form-select" defaultValue="all">
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control amz-search-input"
                  placeholder="Search products, brands and more..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  autoComplete="off"
                />
                <button className="btn amz-search-btn" type="submit">
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="amz-suggestions">
                <div className="amz-suggestion-header">🔍 Suggestions</div>
                {sugLoading ? (
                  <div className="amz-suggestion-loading">Searching...</div>
                ) : suggestions.length === 0 ? (
                  <div className="amz-suggestion-empty">No results found</div>
                ) : (
                  suggestions.map((product) => (
                    <div
                      key={product._id}
                      className="amz-suggestion-item"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <img
                        className="amz-suggestion-img"
                        src={
                          product.photo
                            ? `${API}/uploads/${product.photo}`
                            : "https://via.placeholder.com/36x36?text=?"
                        }
                        alt={product.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/36x36?text=?"; }}
                      />
                      <div className="amz-suggestion-info">
                        <div className="amz-suggestion-name">{product.name}</div>
                        <div className="amz-suggestion-cat">{product.category?.name || "Product"}</div>
                      </div>
                      <div className="amz-suggestion-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {auth?.user && auth?.token ? (
              <div className="dropdown">
                <button
                  className="btn amz-account-btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="amz-line1">Hello, {auth.user.name?.split(" ")[0] || "User"}</span>
                  <span className="amz-line2">Account ▾</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end amz-dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item amz-dropdown-item"
                      to={auth.user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                    >
                      {auth.user.role === "admin" ? "🛠️ Admin Dashboard" : "📊 My Dashboard"}
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button className="dropdown-item amz-dropdown-item danger" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="amz-login-btn">
                  <span className="amz-line1">Hello, sign in</span>
                  <span className="amz-line2">Account ▾</span>
                </Link>
                <Link to="/signup" className="amz-signup-btn">Sign Up</Link>
              </>
            )}
            <Link to="/cart" className="amz-cart-btn">
              {totalItems > 0 && (
                <span className="amz-cart-count">{totalItems > 99 ? "99+" : totalItems}</span>
              )}
              <FaShoppingCart size={22} />
              <span className="amz-cart-label">Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Search ── */}
      <div className="d-md-none" style={{ background: "#131921", padding: "0 12px 10px" }}>
        <form onSubmit={handleSearch}>
          <div className="input-group" style={{ height: 40 }}>
            <input
              type="text"
              className="form-control amz-search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn amz-search-btn" type="submit"><FaSearch /></button>
          </div>
        </form>
      </div>

      {/* ── Delivery Bar (mobile) ── */}
      <div className="amz-delivery-bar d-lg-none">
        <div className="container-fluid px-3 px-lg-4">
          <div className="amz-delivery-inner" onClick={() => setLocationModal(true)} role="button">
            <FaMapMarkerAlt className="amz-delivery-icon" />
            <div className="amz-delivery-text">
              <span className="amz-delivery-line1">Deliver to</span>
              <span className="amz-delivery-line2">
                {deliveryLocation.length > 22 ? deliveryLocation.slice(0, 20) + "…" : deliveryLocation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <nav className="navbar navbar-expand amz-navbar">
        <div className="container-fluid px-3 px-lg-4">
          {/* overflow-y: visible is KEY — lets portal menu escape the navbar */}
          <div
            className="navbar-nav flex-row gap-1"
            style={{ overflowX: "auto", overflowY: "visible" }}
          >
            <NavLink
              to="/" end
              className={({ isActive }) => `nav-link amz-nav-link ${isActive ? "active" : ""}`}
            >
              Home
            </NavLink>

            {/* Category button — hover opens portal menu */}
            <button
              ref={btnRef}
              className={`amz-cat-toggle ${catOpen ? "open" : ""}`}
              onMouseEnter={handleCatEnter}
              onMouseLeave={handleCatLeave}
            >
              Category <FaChevronDown size={10} className="amz-cat-chevron" />
            </button>

            <CategoryPortalMenu
              btnRef={btnRef}
              open={catOpen}
              onEnter={handleCatEnter}
              onLeave={handleCatLeave}
              onClose={() => { clearTimeout(closeTimer.current); setCatOpen(false); }}
              categories={categories}
              catLoading={catLoading}
            />

            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link amz-nav-link ${isActive ? "active" : ""}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link amz-nav-link ${isActive ? "active" : ""}`}
            >
              Contact
            </NavLink>
            <NavLink
              to="/policy"
              className={({ isActive }) => `nav-link amz-nav-link ${isActive ? "active" : ""}`}
            >
              Policy
            </NavLink>
          </div>
        </div>
      </nav>

      {locationModal && (
        <LocationModal
          onClose={() => setLocationModal(false)}
          onApply={handleApplyLocation}
          currentLocation={deliveryLocation}
        />
      )}
    </div>
  );
}

export default Header;