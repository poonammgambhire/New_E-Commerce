import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .srp-root {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }

  .srp-header {
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 12px 0;
    margin-bottom: 16px;
  }

  .srp-query {
    font-size: 1rem;
    color: #111;
  }

  .srp-query span {
    color: #c7511f;
    font-weight: 700;
  }

  .srp-count {
    font-size: 0.82rem;
    color: #888;
    margin-top: 2px;
  }

  .srp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .srp-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: box-shadow .2s;
  }
  .srp-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); }

  .srp-img-wrap {
    aspect-ratio: 1/1;
    background: #fff;
    overflow: hidden;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .srp-img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 0.75rem;
    transition: transform .3s;
  }
  .srp-card:hover .srp-img { transform: scale(1.05); }
  .srp-img-fallback { font-size: 2.5rem; color: #ccc; }

  .srp-card-body {
    padding: 8px 10px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .srp-cat {
    font-size: 0.67rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: .05em;
    font-weight: 500;
  }

  .srp-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #0f1111;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .srp-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 3px;
  }

  .srp-stars {
    background: #388e3c;
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 3px;
  }

  .srp-rating-count { font-size: 0.65rem; color: #007185; }

  .srp-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f1111;
    margin-top: 3px;
  }

  .srp-status {
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 2px;
  }
  .srp-status.oos      { color: #c0392b; }
  .srp-status.low      { color: #c7511f; }
  .srp-status.delivery { color: #007185; }

  .srp-cta {
    margin: 8px 10px 10px;
    background: #ff9900;
    color: #111;
    border: none;
    border-radius: 3px;
    padding: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 1px 3px rgba(255,153,0,.3);
  }
  .srp-cta:hover:not(:disabled) { background: #e68900; }
  .srp-cta:disabled {
    background: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
    box-shadow: none;
  }

  .srp-empty {
    text-align: center;
    padding: 4rem 0;
    color: #aaa;
  }
  .srp-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .srp-empty p { font-size: 0.9rem; margin: 0 0 12px; }
  .srp-empty-btn {
    background: #ff9900; color: #111; border: none;
    padding: 8px 20px; border-radius: 3px;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
  }

  /* Highlight matching text */
  .srp-highlight { background: #fff3cd; border-radius: 2px; padding: 0 2px; }

  @media (max-width: 768px) {
    .srp-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// Search query मधील text highlight करतो
const Highlight = ({ text = "", query = "" }) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.trim()})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="srp-highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        // ✅ Backend search API
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/product/search/${encodeURIComponent(query)}`
        );
        if (data.success) setResults(data.products);
        else setResults([]);
      } catch {
        toast.error("Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="srp-root">
      <style>{styles}</style>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="srp-header">
        <div className="container">
          <div className="srp-query">
            Results for <span>"{query}"</span>
          </div>
          {!loading && (
            <div className="srp-count">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>
      </div>

      <div className="container pb-4">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" style={{ color: "#ff9900" }} />
          </div>
        ) : results.length === 0 ? (
          <div className="srp-empty">
            <div className="srp-empty-icon">🔍</div>
            <p>No results found for <strong>"{query}"</strong></p>
            <p style={{ fontSize: "0.8rem" }}>
              Check your spelling or try a different search term.
            </p>
            <button className="srp-empty-btn" onClick={() => navigate("/")}>
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="srp-grid">
            {results.map((product) => (
              <div
                className="srp-card"
                key={product._id}
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                {/* Image */}
                <div className="srp-img-wrap">
                  {imgErrors[product._id] ? (
                    <div className="srp-img-fallback">📦</div>
                  ) : (
                    <img
                      className="srp-img"
                      src={
                        product.photo
                          ? `${import.meta.env.VITE_API}/uploads/${product.photo}`
                          : "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={product.name}
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [product._id]: true }))
                      }
                    />
                  )}
                </div>

                {/* Body */}
                <div className="srp-card-body">
                  <div className="srp-cat">
                    {product.category?.name || "Uncategorized"}
                  </div>

                  {/* ✅ Search query highlight */}
                  <div className="srp-name">
                    <Highlight text={product.name} query={query} />
                  </div>

                  <div className="srp-rating">
                    <span className="srp-stars">4.2 ★</span>
                    <span className="srp-rating-count">(124)</span>
                  </div>

                  <div className="srp-price">
                    ₹{product.price?.toLocaleString()}
                  </div>

                  {product.quantity === 0 && (
                    <div className="srp-status oos">Out of Stock</div>
                  )}
                  {product.quantity > 0 && product.quantity < 10 && (
                    <div className="srp-status low">
                      Only {product.quantity} left
                    </div>
                  )}
                  {product.shipping && product.quantity > 0 && (
                    <div className="srp-status delivery">✔ FREE Delivery</div>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  className="srp-cta"
                  disabled={product.quantity === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;