import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Spinner, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/Layout/AdminMenu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .up-page { background: #f3f3f3; min-height: 100vh; font-family: 'Inter', sans-serif; }

  .up-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .up-header h2 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0 0 2px; }
  .up-header p  { font-size: 0.76rem; color: #888; margin: 0; }

  .up-admin-chip {
    background: #ff9900; color: #111;
    font-size: 0.72rem; font-weight: 700;
    padding: 5px 14px; border-radius: 3px;
  }

  .up-card { border: 1px solid #ddd !important; border-radius: 4px !important; overflow: hidden; }

  .up-banner {
    background: #131921; padding: 16px 22px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 3px solid #ff9900;
  }
  .up-banner-icon {
    width: 42px; height: 42px; border-radius: 6px;
    background: rgba(255,153,0,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .up-banner h3 { color: #fff; font-size: 1rem; font-weight: 700; margin: 0 0 2px; }
  .up-banner p  { color: #8a9bb0; font-size: 0.75rem; margin: 0; }

  .up-section {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.68rem; font-weight: 700; color: #ff9900;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 14px; margin-top: 4px;
  }
  .up-section::after { content: ''; flex: 1; height: 1px; background: #f0f0f0; }

  .up-label {
    font-size: 0.72rem; font-weight: 700; color: #444;
    text-transform: uppercase; letter-spacing: 0.04em;
    margin-bottom: 5px;
  }
  .up-label .req { color: #e03c3c; }

  /* Bootstrap input override */
  .up-control {
    border: 1px solid #ddd !important;
    border-radius: 3px !important;
    font-size: 0.85rem !important;
    font-family: 'Inter', sans-serif !important;
  }
  .up-control:focus {
    border-color: #ff9900 !important;
    box-shadow: 0 0 0 3px rgba(255,153,0,.15) !important;
  }

  /* Price prefix */
  .up-prefix-group .input-group-text {
    background: #fff; border: 1px solid #ddd;
    border-right: none; border-radius: 3px 0 0 3px;
    font-size: 0.85rem; font-weight: 600; color: #555;
  }
  .up-prefix-group .form-control {
    border-left: none !important;
    border-radius: 0 3px 3px 0 !important;
  }
  .up-prefix-group .form-control:focus {
    border-color: #ff9900 !important;
    box-shadow: 0 0 0 3px rgba(255,153,0,.15) !important;
  }

  /* Photo zone */
  .up-photo-zone {
    border: 2px dashed #ddd; border-radius: 4px;
    background: #fafafa; cursor: pointer;
    text-align: center; padding: 1.5rem 1rem;
    transition: border-color .2s, background .2s;
  }
  .up-photo-zone:hover { border-color: #ff9900; background: #fffbf2; }
  .up-photo-icon { font-size: 2rem; margin-bottom: 6px; }
  .up-photo-zone h6 { font-size: 0.82rem; font-weight: 600; color: #ff9900; margin: 0 0 3px; }
  .up-photo-zone p  { font-size: 0.7rem; color: #aaa; margin: 0; }
  .up-photo-preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: 4px; display: block; }

  .up-current-photo {
    width: 80px; height: 80px; object-fit: cover;
    border-radius: 4px; border: 1px solid #ddd;
  }
  .up-current-label { font-size: 0.7rem; color: #888; margin-bottom: 6px; display: block; }

  .up-remove-btn {
    background: transparent; color: #e03c3c;
    border: 1px solid #e03c3c; font-size: 0.7rem; font-weight: 600;
    padding: 3px 10px; border-radius: 3px; cursor: pointer; transition: all .15s;
  }
  .up-remove-btn:hover { background: #e03c3c; color: #fff; }

  /* Shipping toggle */
  .up-ship-opts { display: flex; gap: 10px; }
  .up-ship-opt {
    flex: 1; padding: 9px; border-radius: 3px;
    border: 1px solid #ddd; text-align: center;
    cursor: pointer; font-size: 0.8rem; font-weight: 500;
    transition: all .15s; background: #fff; color: #555;
    user-select: none;
  }
  .up-ship-opt.yes { border-color: #388e3c; background: #f0faf0; color: #388e3c; font-weight: 700; }
  .up-ship-opt.no  { border-color: #e03c3c; background: #fff5f5; color: #e03c3c; font-weight: 700; }

  /* Buttons */
  .up-submit-btn {
    background: #ff9900; color: #111; border: none;
    padding: 10px 36px; border-radius: 3px;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 2px 6px rgba(255,153,0,.4);
    transition: all .18s; font-family: 'Inter', sans-serif;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .up-submit-btn:hover:not(:disabled) { background: #e68900; }
  .up-submit-btn:active:not(:disabled) { transform: scale(0.98); }
  .up-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .up-cancel-btn {
    background: #fff; color: #555; border: 1px solid #ddd;
    padding: 10px 24px; border-radius: 3px;
    font-size: 0.88rem; font-weight: 500; cursor: pointer;
    transition: all .15s; font-family: 'Inter', sans-serif;
  }
  .up-cancel-btn:hover { background: #f5f5f5; border-color: #bbb; }
`;

const UpdateProduct = () => {
  const { auth }  = useAuth();
  const navigate  = useNavigate();
  const { pid }   = useParams();

  const [name, setName]                 = useState("");
  const [description, setDescription]   = useState("");
  const [price, setPrice]               = useState("");
  const [category, setCategory]         = useState("");
  const [quantity, setQuantity]         = useState("");
  const [shipping, setShipping]         = useState("0");
  const [photo, setPhoto]               = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-category");
        if (data.success) setCategories(data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch product by pid
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get("/api/v1/product/get-all-products", {
          headers: { Authorization: auth?.token },
        });
        if (data.success) {
          const found = data.products.find((p) => p._id === pid);
          if (found) {
            setName(found.name || "");
            setDescription(found.description || "");
            setPrice(found.price || "");
            setCategory(found.category?._id || found.category || "");
            setQuantity(found.quantity || "");
            setShipping(found.shipping ? "1" : "0");
            setCurrentPhoto(found.photo || "");
          } else {
            toast.error("Product not found");
            navigate("/admin/products");
          }
        }
      } catch {
        toast.error("Failed to load product");
      } finally {
        setFetching(false);
      }
    };
    if (pid) fetchProduct();
  }, [pid, auth?.token, navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1_000_000) return toast.error("Photo must be less than 1MB");
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name)        return toast.error("Name is required");
    if (!description) return toast.error("Description is required");
    if (!price)       return toast.error("Price is required");
    if (!category)    return toast.error("Category is required");
    if (!quantity)    return toast.error("Quantity is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("shipping", shipping);
    if (photo) formData.append("photo", photo);

    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/v1/product/update-product/${pid}`,
        formData,
        {
          headers: {
            Authorization: auth?.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/admin/products"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="up-page py-4">
        <style>{styles}</style>
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" style={{ color: "#ff9900" }} />
            <span className="ms-3" style={{ color: "#888", fontSize: "0.85rem" }}>
              Loading product...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="up-page py-4">
      <style>{styles}</style>
      <Toaster position="top-right" />

      <div className="container-fluid px-4">
        <Row className="g-3">

          {/* Sidebar */}
          <Col md={3} lg={2}>
            <AdminMenu />
          </Col>

          {/* Content */}
          <Col md={9} lg={10}>

            {/* Header */}
            <div className="up-header">
              <div>
                <h2>Update Product</h2>
                <p>Edit product details and save changes</p>
              </div>
              <span className="up-admin-chip">Admin</span>
            </div>

            <div className="card up-card shadow-sm">

              {/* Banner */}
              <div className="up-banner">
                <div className="up-banner-icon">✏️</div>
                <div>
                  <h3>Edit: {name}</h3>
                  <p>Update the details below and save changes</p>
                </div>
              </div>

              <div className="card-body p-4">
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">

                    {/* ── Photo ── */}
                    <Col xs={12}>
                      <div className="up-section">Product Photo</div>

                      {!photoPreview && (
                        <div className="mb-3">
                          <span className="up-current-label">Current photo:</span>
                          <img
                            className="up-current-photo"
                            src={currentPhoto ? `${import.meta.env.VITE_API}/uploads/${currentPhoto}` : ""}
                            alt="current product"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </div>
                      )}

                      <div
                        className="up-photo-zone"
                        onClick={() => document.getElementById("up-photo-input").click()}
                      >
                        {photoPreview ? (
                          <img src={photoPreview} alt="preview" className="up-photo-preview" />
                        ) : (
                          <>
                            <div className="up-photo-icon">📷</div>
                            <h6>Click to change photo</h6>
                            <p>JPG, PNG, WEBP — max 1MB</p>
                          </>
                        )}
                      </div>

                      <Form.Control
                        id="up-photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        style={{ display: "none" }}
                      />

                      {photo && (
                        <div className="mt-2 d-flex align-items-center justify-content-between">
                          <small className="text-muted" style={{ fontSize: "0.73rem" }}>
                            {photo.name}
                          </small>
                          <button
                            type="button"
                            className="up-remove-btn"
                            onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </Col>

                    {/* ── Basic Info ── */}
                    <Col xs={12} className="mt-2">
                      <div className="up-section">Basic Info</div>
                    </Col>

                    <Col xs={12}>
                      <Form.Label className="up-label">
                        Product Name <span className="req">*</span>
                      </Form.Label>
                      <Form.Control
                        className="up-control"
                        type="text"
                        placeholder="Product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Col>

                    <Col xs={12}>
                      <Form.Label className="up-label">
                        Description <span className="req">*</span>
                      </Form.Label>
                      <Form.Control
                        className="up-control"
                        as="textarea"
                        rows={4}
                        placeholder="Product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Col>

                    {/* ── Pricing ── */}
                    <Col xs={12} className="mt-2">
                      <div className="up-section">Pricing & Inventory</div>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="up-label">
                        Price (₹) <span className="req">*</span>
                      </Form.Label>
                      <div className="input-group up-prefix-group">
                        <span className="input-group-text">₹</span>
                        <Form.Control
                          className="up-control"
                          type="number"
                          placeholder="0"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="up-label">
                        Quantity <span className="req">*</span>
                      </Form.Label>
                      <Form.Control
                        className="up-control"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Label className="up-label">
                        Category <span className="req">*</span>
                      </Form.Label>
                      <Form.Select
                        className="up-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="up-label">Shipping Available</Form.Label>
                      <div className="up-ship-opts">
                        <div
                          className={`up-ship-opt ${shipping === "1" ? "yes" : ""}`}
                          onClick={() => setShipping("1")}
                        >
                          ✔ Yes — Free
                        </div>
                        <div
                          className={`up-ship-opt ${shipping === "0" ? "no" : ""}`}
                          onClick={() => setShipping("0")}
                        >
                          ✘ No
                        </div>
                      </div>
                    </Col>

                    {/* ── Submit ── */}
                    <Col xs={12} className="d-flex gap-3 mt-2 flex-wrap">
                      <button type="submit" className="up-submit-btn" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" />
                            Saving...
                          </>
                        ) : (
                          <>💾 Save Changes</>
                        )}
                      </button>
                      <button
                        type="button"
                        className="up-cancel-btn"
                        onClick={() => navigate("/admin/products")}
                      >
                        Cancel
                      </button>
                    </Col>

                  </Row>
                </Form>
              </div>
            </div>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UpdateProduct;