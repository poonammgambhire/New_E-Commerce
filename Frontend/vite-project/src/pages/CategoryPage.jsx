import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .cp-page {
    min-height: 100vh;
    background: #f3f3f3;
    font-family: 'Inter', sans-serif;
    padding: 24px 0 40px;
  }

  .cp-breadcrumb {
    font-size: 0.78rem; color: #888;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 6px;
  }
  .cp-breadcrumb a { color: #2874f0; text-decoration: none; }
  .cp-breadcrumb a:hover { text-decoration: underline; }
  .cp-breadcrumb span { color: #555; font-weight: 600; }

  .cp-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
  }
  .cp-title { font-size: 1.3rem; font-weight: 700; color: #111; margin: 0; }
  .cp-count {
    background: #ff9900; color: #111;
    font-size: 0.75rem; font-weight: 700;
    padding: 5px 14px; border-radius: 3px;
  }

  .cp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
  }

  .cp-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    transition: box-shadow .2s, transform .2s;
    display: flex; flex-direction: column;
    text-decoration: none;
  }
  .cp-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,.12);
    transform: translateY(-2px);
  }

  .cp-img-wrap {
    width: 100%; aspect-ratio: 1;
    background: #f8f8f8;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .cp-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .3s;
  }
  .cp-card:hover .cp-img-wrap img { transform: scale(1.05); }
  .cp-img-placeholder { font-size: 3rem; }

  .cp-card-body {
    padding: 12px;
    display: flex; flex-direction: column; gap: 6px;
    flex: 1;
  }
  .cp-name {
    font-size: 0.87rem; font-weight: 600; color: #111;
    line-height: 1.4; margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cp-desc {
    font-size: 0.75rem; color: #888; margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cp-price {
    font-size: 1rem; font-weight: 700; color: #111; margin: 0;
  }

  .cp-actions {
    display: flex; gap: 8px;
    margin-top: auto; padding-top: 8px;
  }
  .cp-btn-detail {
    flex: 1; padding: 8px;
    background: #fff; color: #2874f0;
    border: 1px solid #2874f0;
    border-radius: 3px; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all .15s;
    font-family: 'Inter', sans-serif;
    text-align: center; text-decoration: none;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-btn-detail:hover { background: #2874f0; color: #fff; }

  .cp-btn-cart {
    flex: 1; padding: 8px;
    background: #ff9900; color: #111;
    border: none; border-radius: 3px;
    font-size: 0.78rem; font-weight: 700;
    cursor: pointer; transition: background .15s;
    font-family: 'Inter', sans-serif;
  }
  .cp-btn-cart:hover { background: #e68900; }

  .cp-skeleton {
    background: #fff; border: 1px solid #e0e0e0;
    border-radius: 4px; overflow: hidden;
  }
  .cp-skeleton-img {
    width: 100%; aspect-ratio: 1;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .cp-skeleton-line {
    height: 12px; border-radius: 3px; margin: 10px 12px 6px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .cp-empty, .cp-error {
    text-align: center; padding: 60px 0;
    grid-column: 1 / -1;
  }
  .cp-empty { color: #aaa; }
  .cp-empty-icon { font-size: 3rem; margin-bottom: 10px; }
  .cp-empty p, .cp-error p { font-size: 0.9rem; margin: 4px 0 0; }
  .cp-error p { color: #e03c3c; }
`;

const API = import.meta.env.VITE_API || "http://localhost:5000";

export default function CategoryPage() {
  const { slug }      = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setProducts([]);
    setCategory(null);

    const fetchData = async () => {
      try {
        const { data: catData } = await axios.get(
          `/api/v1/category/single-category/${slug}`
        );

        if (!catData.success) {
          setError("Category not found.");
          return;
        }
        setCategory(catData.category);

        const { data: prodData } = await axios.post(
          `/api/v1/product/filter-products`,
          { checked: [catData.category._id], radio: [] }
        );

        if (prodData.success) {
          setProducts(prodData.products || []);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`"${product.name}" added to cart! 🛒`);
  };

  return (
    <div className="cp-page">
      <style>{styles}</style>

      <div className="container-fluid px-3 px-lg-5">
        <div className="cp-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>{category?.name || slug}</span>
        </div>

        <div className="cp-header">
          <h1 className="cp-title">
            {category ? category.name : "Loading..."}
          </h1>
          {!loading && !error && (
            <span className="cp-count">{products.length} Products</span>
          )}
        </div>

        <div className="cp-grid">
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cp-skeleton">
              <div className="cp-skeleton-img" />
              <div className="cp-skeleton-line" style={{ width: "75%" }} />
              <div className="cp-skeleton-line" style={{ width: "50%", margin: "0 12px 6px" }} />
              <div className="cp-skeleton-line" style={{ width: "35%", margin: "0 12px 14px" }} />
            </div>
          ))}

          {!loading && error && (
            <div className="cp-error">
              <div style={{ fontSize: "2.5rem" }}>⚠️</div>
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                style={{
                  marginTop: 14, background: "#ff9900", border: "none",
                  padding: "8px 22px", borderRadius: 3,
                  fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif"
                }}
              >
                Go Back
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="cp-empty">
              <div className="cp-empty-icon">📦</div>
              <p>No products found in this category.</p>
            </div>
          )}

          {!loading && !error && products.map((product) => (
            <Link
              key={product._id}
              className="cp-card"
              to={`/product/${product.slug}`}
            >
              <div className="cp-img-wrap">
                {/* ✅ FIXED: Multer filename फक्त save होतो, म्हणून /uploads/filename वापरतो */}
                <img
                  src={
                    product.photo
                      ? `${API}/uploads/${product.photo}`
                      : "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="cp-img-placeholder" style={{ display: "none" }}>🛍️</div>
              </div>

              <div className="cp-card-body">
                <p className="cp-name">{product.name}</p>
                <p className="cp-desc">{product.description}</p>
                <p className="cp-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <div className="cp-actions">
                  <span className="cp-btn-detail">Details</span>
                  <button
                    className="cp-btn-cart"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    🛒 Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}