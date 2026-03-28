import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .sp-root {
    background: #e3e6e6;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0f1111;
  }

  .sp-root a { color: #007185; text-decoration: none; }
  .sp-root a:hover { color: #c7511f; text-decoration: underline; }

  .sp-breadcrumb {
    background: #fff;
    padding: 6px 0;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    color: #565959;
  }

  .sp-breadcrumb span { cursor: pointer; color: #007185; }
  .sp-breadcrumb span:hover { color: #c7511f; text-decoration: underline; }
  .sp-breadcrumb .sep { margin: 0 4px; color: #565959; }

  .sp-main {
    background: #fff;
    margin: 8px 0;
    padding: 16px;
  }

  .sp-img-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .sp-img-main {
    width: 100%;
    max-width: 380px;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    background: #fff;
    overflow: hidden;
    cursor: zoom-in;
  }

  .sp-img-main img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }

  .sp-img-main:hover img { transform: scale(1.08); }

  .sp-details { padding: 0 12px; }

  .sp-category-tag {
    font-size: 11px;
    color: #565959;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  .sp-title {
    font-size: 1.3rem;
    font-weight: 400;
    line-height: 1.4;
    color: #0f1111;
    margin-bottom: 8px;
  }

  .sp-rating-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e7e7e7;
  }

  .sp-stars { color: #f90; font-size: 16px; letter-spacing: -2px; }
  .sp-rating-num { color: #007185; font-size: 13px; cursor: pointer; }
  .sp-rating-num:hover { color: #c7511f; text-decoration: underline; }
  .sp-divider-dot { color: #ddd; }

  .sp-price-block { margin-bottom: 14px; }
  .sp-price-label { font-size: 12px; color: #565959; }
  .sp-price { font-size: 1.6rem; font-weight: 400; color: #0f1111; }
  .sp-price-sym { font-size: 0.9rem; vertical-align: super; font-weight: 400; }
  .sp-savings { font-size: 12px; color: #c7511f; margin-top: 2px; }

  .sp-delivery {
    background: #f0f2f2;
    border-radius: 4px;
    padding: 10px 12px;
    margin-bottom: 14px;
    font-size: 13px;
  }

  .sp-delivery .free { color: #007600; font-weight: 600; }
  .sp-delivery .date { font-weight: 600; }

  .sp-stock {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 14px;
  }

  .sp-stock.in { color: #007600; }
  .sp-stock.low { color: #c7511f; }
  .sp-stock.out { color: #c40000; }

  .sp-about {
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e7e7e7;
  }

  .sp-about h6 { font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; }

  .sp-about ul {
    padding-left: 18px;
    margin: 0;
  }

  .sp-about ul li {
    font-size: 13px;
    color: #0f1111;
    margin-bottom: 4px;
    line-height: 1.5;
  }

  .sp-buybox {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    position: sticky;
    top: 8px;
  }

  .sp-buybox-price { font-size: 1.5rem; font-weight: 400; margin-bottom: 6px; }

  .sp-buybox-delivery {
    font-size: 13px;
    color: #0f1111;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .sp-buybox-delivery .free { color: #007600; font-weight: 600; }

  .sp-buybox-stock {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .sp-buybox-stock.in { color: #007600; }
  .sp-buybox-stock.out { color: #c40000; }

  .sp-qty-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 13px;
  }

  .sp-qty-select {
    border: 1px solid #888;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    background: #f0f2f2;
    cursor: pointer;
  }

  .sp-btn-cart {
    width: 100%;
    background: #ffd814;
    border: 1px solid #fcd200;
    border-radius: 20px;
    padding: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 8px;
    transition: background 0.15s;
    color: #0f1111;
  }

  .sp-btn-cart:hover { background: #f7ca00; }
  .sp-btn-cart:disabled { background: #e7e7e7; border-color: #e7e7e7; cursor: not-allowed; color: #999; }

  .sp-btn-buy {
    width: 100%;
    background: #ff9900;
    border: 1px solid #e68a00;
    border-radius: 20px;
    padding: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 12px;
    transition: background 0.15s;
    color: #0f1111;
  }

  .sp-btn-buy:hover { background: #e68a00; }
  .sp-btn-buy:disabled { background: #e7e7e7; border-color: #e7e7e7; cursor: not-allowed; color: #999; }

  .sp-secure {
    text-align: center;
    font-size: 12px;
    color: #565959;
    margin-bottom: 12px;
  }

  .sp-buybox-meta { font-size: 12px; color: #0f1111; }
  .sp-buybox-meta div { margin-bottom: 4px; }
  .sp-buybox-meta span { color: #565959; }

  .sp-related { background: #fff; margin-top: 8px; padding: 16px; }
  .sp-related h5 { font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; border-bottom: 2px solid #f90; padding-bottom: 8px; display: inline-block; }

  .sp-rel-card {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s;
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sp-rel-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.15); }

  .sp-rel-img {
    aspect-ratio: 1/1;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    overflow: hidden;
  }

  .sp-rel-img img { width: 100%; height: 100%; object-fit: contain; }

  .sp-rel-body { padding: 8px; flex: 1; display: flex; flex-direction: column; }
  .sp-rel-name { font-size: 12px; color: #0f1111; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; flex: 1; margin-bottom: 4px; }
  .sp-rel-stars { color: #f90; font-size: 11px; margin-bottom: 2px; }
  .sp-rel-price { font-size: 13px; font-weight: 600; color: #0f1111; }

  .sp-rel-btn {
    margin: 0 8px 8px;
    background: #ffd814;
    border: 1px solid #fcd200;
    border-radius: 16px;
    padding: 5px;
    font-size: 11px;
    cursor: pointer;
    width: calc(100% - 16px);
    transition: background 0.15s;
  }

  .sp-rel-btn:hover { background: #f7ca00; }
  .sp-rel-btn:disabled { background: #e7e7e7; border-color: #e7e7e7; cursor: not-allowed; }

  @media (max-width: 768px) {
    .sp-buybox { position: static; margin-top: 16px; }
  }
`;

const StarRating = ({ rating = 4.2 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="sp-stars">
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { auth } = useAuth();

  const [product, setProduct]           = useState(null);
  const [related, setRelated]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [placing, setPlacing]           = useState(false);
  const [qty, setQty]                   = useState(1);
  const [imgError, setImgError]         = useState(false);
  const [relImgErrors, setRelImgErrors] = useState({});

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/get-product/${slug}`);
      if (data.success) { setProduct(data.product); setImgError(false); }
    } catch { toast.error("Failed to load product"); }
    finally { setLoading(false); }
  }, [slug]);

  const fetchRelated = useCallback(async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related/${pid}/${cid}`);
      if (data.success) setRelated(data.products);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchProduct(); setQty(1); }, [fetchProduct]);
  useEffect(() => {
    if (product?._id && product?.category?._id)
      fetchRelated(product._id, product.category._id);
  }, [product, fetchRelated]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // ✅ Buy Now — order create करून orders page ला जातो
  const handleBuyNow = async () => {
    if (!auth?.token) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    try {
      setPlacing(true);

      const products = [{ product: product._id, quantity: qty }];
      const totalAmount = product.price * qty;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/orders/create`,
        { products, totalAmount },
        { headers: { Authorization: `Bearer ${auth.token}` } }  // ✅ Bearer fix
      );

      if (data.success) {
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Spinner animation="border" style={{ color: "#f90" }} />
    </div>
  );

  if (!product) return (
    <div className="text-center py-5">
      <div style={{ fontSize: "3rem" }}>😕</div>
      <h5 className="mt-3">Product not found</h5>
      <button className="btn btn-warning mt-2 rounded-pill px-4" onClick={() => navigate("/")}>Go Home</button>
    </div>
  );

  const stockStatus = product.quantity === 0 ? "out" : product.quantity < 10 ? "low" : "in";
  const stockLabel  = product.quantity === 0 ? "Out of Stock" : product.quantity < 10 ? `Only ${product.quantity} left in stock - order soon` : "In Stock";

  const getProductImg = (photo) =>
    photo
      ? `${import.meta.env.VITE_API}/uploads/${photo}`
      : "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="sp-root">
      <style>{styles}</style>
      <Toaster position="top-right" />

      {/* Breadcrumb */}
      <div className="sp-breadcrumb">
        <div className="container">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="sep">›</span>
          <span onClick={() => navigate("/")}>{product.category?.name || "Products"}</span>
          <span className="sep">›</span>
          <span style={{ color: "#0f1111", cursor: "default" }}>{product.name}</span>
        </div>
      </div>

      {/* Main */}
      <div className="container">
        <div className="sp-main">
          <div className="row">

            {/* Image */}
            <div className="col-12 col-md-4">
              <div className="sp-img-panel">
                <div className="sp-img-main">
                  {imgError ? (
                    <span style={{ fontSize: "5rem", color: "#ccc" }}>📦</span>
                  ) : (
                    <img
                      src={getProductImg(product.photo)}
                      alt={product.name}
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>

                {/* Mobile buttons */}
                <div className="d-md-none w-100 mt-2">
                  <button className="sp-btn-cart" disabled={product.quantity === 0} onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button
                    className="sp-btn-buy"
                    disabled={product.quantity === 0 || placing}
                    onClick={handleBuyNow}
                  >
                    {placing ? "Placing..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="col-12 col-md-5">
              <div className="sp-details">
                <div className="sp-category-tag">{product.category?.name}</div>
                <h1 className="sp-title">{product.name}</h1>

                <div className="sp-rating-row">
                  <StarRating />
                  <a className="sp-rating-num">4.2</a>
                  <span className="sp-divider-dot">|</span>
                  <a className="sp-rating-num">1,234 ratings</a>
                  <span className="sp-divider-dot">|</span>
                  <a className="sp-rating-num">89 answered questions</a>
                </div>

                <div className="sp-price-block">
                  <div className="sp-price-label">M.R.P.:</div>
                  <div className="sp-price">
                    <span className="sp-price-sym">₹</span>
                    {product.price?.toLocaleString()}
                  </div>
                  <div className="sp-savings">Inclusive of all taxes</div>
                </div>

                {product.shipping && (
                  <div className="sp-delivery">
                    <div><span className="free">FREE Delivery</span> <strong>Tomorrow</strong> if you order within <strong>5 hrs 30 mins</strong></div>
                    <div style={{ marginTop: 4, color: "#007185", cursor: "pointer" }}>Details</div>
                  </div>
                )}

                <div className={`sp-stock ${stockStatus}`}>{stockLabel}</div>

                <div className="sp-about">
                  <h6>About this item</h6>
                  <ul>
                    {product.description?.split(".").filter(s => s.trim()).map((s, i) => (
                      <li key={i}>{s.trim()}.</li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: 13, color: "#565959" }}>
                  <div><strong style={{ color: "#0f1111" }}>Category:</strong> {product.category?.name}</div>
                  <div><strong style={{ color: "#0f1111" }}>Quantity Available:</strong> {product.quantity}</div>
                  <div><strong style={{ color: "#0f1111" }}>Shipping:</strong> {product.shipping ? "Available" : "Not available"}</div>
                </div>
              </div>
            </div>

            {/* Buy Box */}
            <div className="col-12 col-md-3 d-none d-md-block">
              <div className="sp-buybox">
                <div className="sp-buybox-price">
                  <span style={{ fontSize: "0.85rem", verticalAlign: "super" }}>₹</span>
                  {product.price?.toLocaleString()}
                </div>

                {product.shipping && (
                  <div className="sp-buybox-delivery">
                    <span className="free">FREE Delivery</span> <strong>Tomorrow</strong>
                  </div>
                )}

                <div className={`sp-buybox-stock ${product.quantity > 0 ? "in" : "out"}`}>
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </div>

                {product.quantity > 0 && (
                  <div className="sp-qty-row">
                    <span>Qty:</span>
                    <select
                      className="sp-qty-select"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(product.quantity, 10) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button className="sp-btn-cart" disabled={product.quantity === 0} onClick={handleAddToCart}>
                  Add to Cart
                </button>

                {/* ✅ Buy Now — order create करतो */}
                <button
                  className="sp-btn-buy"
                  disabled={product.quantity === 0 || placing}
                  onClick={handleBuyNow}
                >
                  {placing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" />
                      Placing...
                    </>
                  ) : "Buy Now"}
                </button>

                <div className="sp-secure">🔒 Secure transaction</div>

                <div className="sp-buybox-meta">
                  <div><span>Ships from </span> MyShop</div>
                  <div><span>Sold by </span> MyShop</div>
                  <div><span>Returns </span> Eligible for Return within 10 days</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="sp-related">
            <h5>Customers also bought</h5>
            <div className="row g-3">
              {related.map((p) => (
                <div className="col-6 col-sm-4 col-lg-2" key={p._id}>
                  <div
                    className="sp-rel-card"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <div className="sp-rel-img">
                      {relImgErrors[p._id] ? (
                        <span style={{ fontSize: "2rem", color: "#ccc" }}>📦</span>
                      ) : (
                        <img
                          src={getProductImg(p.photo)}
                          alt={p.name}
                          onError={() => setRelImgErrors((prev) => ({ ...prev, [p._id]: true }))}
                        />
                      )}
                    </div>
                    <div className="sp-rel-body">
                      <div className="sp-rel-name">{p.name}</div>
                      <div className="sp-rel-stars">★★★★☆</div>
                      <div className="sp-rel-price">₹{p.price?.toLocaleString()}</div>
                    </div>
                    <button
                      className="sp-rel-btn"
                      disabled={p.quantity === 0}
                      onClick={(e) => { e.stopPropagation(); addToCart(p); toast.success(`${p.name} added!`); }}
                    >
                      {p.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;