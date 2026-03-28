import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Spinner, Modal, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/Layout/AdminMenu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .prod-root {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    padding: 1.5rem;
  }

  .prod-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.5rem;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .prod-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  .prod-header h2 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0 0 2px; }
  .prod-header p  { font-size: 0.76rem; color: #888; margin: 0; }

  .prod-add-btn {
    background: #ff9900; color: #111;
    border: none; padding: 8px 18px; border-radius: 3px;
    font-size: 0.82rem; font-weight: 700; cursor: pointer;
    transition: background .15s; font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 5px rgba(255,153,0,.35);
  }
  .prod-add-btn:hover { background: #e68900; }

  /* ── Toolbar ── */
  .prod-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 1.25rem;
  }

  .prod-search-wrap { position: relative; flex: 1; max-width: 340px; }
  .prod-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); }

  .prod-search {
    width: 100%; padding: 8px 12px 8px 2.2rem;
    border: 1px solid #ddd; border-radius: 3px;
    font-size: 0.83rem; background: #fff; outline: none;
    font-family: 'Inter', sans-serif; transition: border-color .15s;
  }
  .prod-search:focus { border-color: #ff9900; box-shadow: 0 0 0 2px rgba(255,153,0,.15); }

  .prod-count-chip {
    background: #fff; border: 1px solid #ddd; border-radius: 3px;
    padding: 7px 14px; font-size: 0.78rem; color: #111;
    font-weight: 600; white-space: nowrap;
  }

  /* ── Grid ── */
  .prod-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 14px;
  }

  /* ── Card ── */
  .prod-card {
    background: #fff; border: 1px solid #ddd; border-radius: 4px;
    overflow: hidden; display: flex; flex-direction: column;
    transition: box-shadow .2s;
  }
  .prod-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); }

  /* Image */
  .prod-img-zone {
    position: relative; width: 100%; aspect-ratio: 1/1;
    background: #f9f9f9; display: flex; align-items: center;
    justify-content: center; overflow: hidden;
    border-bottom: 1px solid #f0f0f0;
  }
  .prod-img {
    width: 100%; height: 100%; object-fit: contain;
    padding: 1rem; transition: transform .3s;
  }
  .prod-card:hover .prod-img { transform: scale(1.05); }
  .prod-img-fallback { font-size: 3.5rem; color: #bbb; }

  .prod-badge-stock {
    position: absolute; top: 8px; left: 8px;
    background: #c0392b; color: #fff;
    font-size: 0.6rem; font-weight: 700;
    padding: 3px 7px; border-radius: 2px;
  }
  .prod-badge-ship {
    position: absolute; bottom: 8px; left: 8px;
    background: #131921; color: #ff9900;
    font-size: 0.56rem; font-weight: 700;
    padding: 2px 7px; border-radius: 2px;
    text-transform: uppercase; letter-spacing: .04em;
  }

  /* Body */
  .prod-card-body {
    padding: 10px 12px 0; flex: 1;
    display: flex; flex-direction: column; gap: 4px;
  }
  .prod-brand {
    font-size: 0.68rem; color: #888; font-weight: 500;
    text-transform: uppercase; letter-spacing: .04em;
  }
  .prod-name {
    font-size: 0.87rem; font-weight: 600; color: #111;
    line-height: 1.3; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .prod-rating-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .prod-rating-pill {
    background: #388e3c; color: #fff;
    font-size: 0.63rem; font-weight: 700;
    padding: 2px 6px; border-radius: 3px;
  }
  .prod-rating-count { font-size: 0.7rem; color: #888; }
  .prod-price { font-size: 1.05rem; font-weight: 700; color: #0f1111; margin-top: 4px; }
  .prod-delivery {
    font-size: 0.7rem; color: #888; margin-top: 2px; padding-bottom: 10px;
  }
  .prod-delivery span { color: #007185; font-weight: 500; }

  /* Actions */
  .prod-card-actions {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; padding: 10px 12px 12px;
  }

  .prod-act-btn {
    padding: 8px 0; font-size: 0.73rem; font-weight: 700;
    border: none; border-radius: 3px; cursor: pointer;
    transition: all .15s; font-family: 'Inter', sans-serif;
    position: relative; overflow: hidden;
  }
  .prod-act-btn:active { transform: scale(0.97); }

  .prod-act-btn.edit {
    background: #ff9900; color: #111;
    box-shadow: 0 1px 4px rgba(255,153,0,.3);
  }
  .prod-act-btn.edit:hover { background: #e68900; }

  .prod-act-btn.del {
    background: #fff; color: #c0392b;
    border: 1px solid #ddd;
  }
  .prod-act-btn.del:hover { background: #fff5f5; border-color: #c0392b; }

  /* Empty / Loading */
  .prod-empty { grid-column: 1/-1; text-align: center; padding: 4rem 0; color: #aaa; }
  .prod-empty-icon { font-size: 2.5rem; margin-bottom: .75rem; }
  .prod-empty p { font-size: 0.9rem; margin: 0; }
  .prod-loading {
    grid-column: 1/-1; display: flex; flex-direction: column;
    align-items: center; gap: .75rem; padding: 4rem 0;
    color: #aaa; font-size: 0.85rem;
  }

  @media (max-width: 900px) {
    .prod-layout { grid-template-columns: 1fr; }
    .prod-root   { padding: 1rem; }
    .prod-grid   { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  }
`;

const Products = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts]         = useState([]);
  const [fetching, setFetching]         = useState(true);
  const [search, setSearch]             = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgErrors, setImgErrors]       = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await axios.get("/api/v1/product/get-all-products", {
        headers: { Authorization: auth?.token },
      });
      if (data.success) setProducts(data.products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setFetching(false);
    }
  }, [auth?.token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${deleteTarget._id}`,
        { headers: { Authorization: auth?.token } }
      );
      if (data.success) {
        toast.success("Product deleted!");
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="prod-root">
      <style>{styles}</style>
      <Toaster position="top-right" />

      <div className="prod-layout">

        {/* Sidebar */}
        <aside>
          <AdminMenu />
        </aside>

        <div>

          {/* Header */}
          <div className="prod-header">
            <div>
              <h2>All Products</h2>
              <p>Manage your product catalog</p>
            </div>
            <button
              className="prod-add-btn"
              onClick={() => navigate("/admin/create-product")}
            >
              + Add Product
            </button>
          </div>

          {/* Toolbar */}
          <div className="prod-toolbar">
            <div className="prod-search-wrap">
              <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="prod-search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="prod-count-chip">{filtered.length} / {products.length} Products</div>
          </div>

          {/* Grid */}
          <div className="prod-grid">
            {fetching ? (
              <div className="prod-loading">
                <Spinner animation="border" size="sm" style={{ color: "#ff9900" }} />
                <span>Loading products...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="prod-empty">
                <div className="prod-empty-icon">📭</div>
                <p>{search ? `No results for "${search}"` : "No products yet."}</p>
              </div>
            ) : (
              filtered.map((product) => (
                <div className="prod-card" key={product._id}>

                  {/* Image */}
                  <div className="prod-img-zone">
                    {imgErrors[product._id] ? (
                      <div className="prod-img-fallback">📦</div>
                    ) : (
                      <img
                        className="prod-img"
                        src={`${import.meta.env.VITE_API}/uploads/${product.photo}`}
                        alt={product.name}
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [product._id]: true }))
                        }
                      />
                    )}
                    {product.quantity < 10 && (
                      <span className="prod-badge-stock">Low Stock</span>
                    )}
                    {product.shipping && (
                      <span className="prod-badge-ship">✔ Prime</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="prod-card-body">
                    <div className="prod-brand">
                      {product.category?.name || "Uncategorized"}
                    </div>
                    <div className="prod-name">{product.name}</div>
                    <div className="prod-rating-row">
                      <span className="prod-rating-pill">4.2 ★</span>
                      <span className="prod-rating-count">Qty: {product.quantity}</span>
                    </div>
                    <div className="prod-price">
                      ₹{product.price?.toLocaleString()}
                    </div>
                    <div className="prod-delivery">
                      {product.shipping
                        ? <><span>FREE Delivery</span> by Tomorrow</>
                        : "No shipping available"
                      }
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="prod-card-actions">
                    <button
                      className="prod-act-btn edit"
                      onClick={() => navigate(`/admin/update-product/${product._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="prod-act-btn del"
                      onClick={() => {
                        setDeleteTarget(product);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>"{deleteTarget?.name}"</strong>? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;