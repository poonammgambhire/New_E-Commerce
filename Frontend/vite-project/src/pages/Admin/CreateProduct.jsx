import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/Layout/AdminMenu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .cp-page { background: #f3f3f3; min-height: 100vh; font-family: 'Inter', sans-serif; }

  /* ── Header ── */
  .cp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .cp-header h2 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0 0 2px; }
  .cp-header p  { font-size: 0.76rem; color: #888; margin: 0; }
  .cp-admin-chip {
    background: #ff9900; color: #111;
    font-size: 0.72rem; font-weight: 700;
    padding: 5px 14px; border-radius: 3px;
  }

  /* ── Card ── */
  .cp-card {
    background: #fff;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    overflow: hidden;
  }

  /* ── Banner ── */
  .cp-banner {
    background: #131921;
    padding: 16px 22px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 3px solid #ff9900;
  }
  .cp-banner-icon {
    width: 42px; height: 42px; border-radius: 6px;
    background: rgba(255,153,0,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .cp-banner h3 { color: #fff; font-size: 1rem; font-weight: 700; margin: 0 0 2px; }
  .cp-banner p  { color: #8a9bb0; font-size: 0.75rem; margin: 0; }

  /* ── Section heading ── */
  .cp-section {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.68rem; font-weight: 700; color: #ff9900;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 14px; margin-top: 4px;
  }
  .cp-section::after { content: ''; flex: 1; height: 1px; background: #f0f0f0; }

  /* ── Labels ── */
  .cp-label {
    font-size: 0.72rem; font-weight: 700; color: #444;
    text-transform: uppercase; letter-spacing: 0.04em;
    display: block; margin-bottom: 5px;
  }
  .cp-label span { color: #e03c3c; }

  /* ── Inputs ── */
  .cp-input, .cp-select, .cp-textarea {
    width: 100%; padding: 9px 12px;
    border: 1px solid #ddd !important; border-radius: 3px !important;
    font-size: 0.85rem !important; font-family: 'Inter', sans-serif;
    background: #fff; color: #111; outline: none;
    transition: border-color .15s, box-shadow .15s !important;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: #ff9900 !important;
    box-shadow: 0 0 0 3px rgba(255,153,0,.15) !important;
  }
  .cp-input::placeholder, .cp-textarea::placeholder { color: #bbb; }

  /* Price prefix */
  .cp-input-wrap { position: relative; }
  .cp-prefix {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    font-size: 0.85rem; font-weight: 600; color: #555;
  }
  .cp-input.with-prefix { padding-left: 24px; }

  /* ── Photo zone ── */
  .cp-photo-zone {
    border: 2px dashed #ddd; border-radius: 4px;
    background: #fafafa;
    cursor: pointer; text-align: center; padding: 2rem 1rem;
    transition: border-color .2s, background .2s;
  }
  .cp-photo-zone:hover { border-color: #ff9900; background: #fffbf2; }
  .cp-photo-icon { font-size: 2.2rem; margin-bottom: 8px; }
  .cp-photo-zone h6 { font-size: 0.85rem; font-weight: 600; color: #ff9900; margin: 0 0 4px; }
  .cp-photo-zone p  { font-size: 0.72rem; color: #aaa; margin: 0; }
  .cp-photo-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px; display: block; }

  .cp-remove-btn {
    background: transparent; color: #e03c3c;
    border: 1px solid #e03c3c; font-size: 0.7rem; font-weight: 600;
    padding: 3px 10px; border-radius: 3px; cursor: pointer; transition: all .15s;
  }
  .cp-remove-btn:hover { background: #e03c3c; color: #fff; }

  /* ── Shipping toggle ── */
  .cp-ship-opts { display: flex; gap: 10px; }
  .cp-ship-opt {
    flex: 1; padding: 9px; border-radius: 3px;
    border: 1px solid #ddd; text-align: center;
    cursor: pointer; font-size: 0.8rem; font-weight: 500;
    transition: all .15s; background: #fff; color: #555;
    user-select: none;
  }
  .cp-ship-opt.yes { border-color: #388e3c; background: #f0faf0; color: #388e3c; font-weight: 700; }
  .cp-ship-opt.no  { border-color: #e03c3c; background: #fff5f5; color: #e03c3c; font-weight: 700; }

  /* ── Buttons ── */
  .cp-submit {
    background: #ff9900; color: #111;
    border: none; padding: 11px 36px; border-radius: 3px;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 2px 6px rgba(255,153,0,.4);
    transition: all .18s; font-family: 'Inter', sans-serif;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .cp-submit:hover:not(:disabled) { background: #e68900; box-shadow: 0 4px 12px rgba(255,153,0,.5); }
  .cp-submit:active:not(:disabled) { transform: scale(0.98); }
  .cp-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  .cp-cancel {
    background: #fff; color: #555;
    border: 1px solid #ddd; padding: 11px 24px; border-radius: 3px;
    font-size: 0.88rem; font-weight: 500; cursor: pointer;
    transition: all .15s; font-family: 'Inter', sans-serif;
  }
  .cp-cancel:hover { background: #f5f5f5; border-color: #bbb; }
`;

const CreateProduct = () => {
  const { auth }    = useAuth();
  const navigate    = useNavigate();

  const [name, setName]                     = useState("");
  const [description, setDescription]       = useState("");
  const [price, setPrice]                   = useState("");
  const [category, setCategory]             = useState("");
  const [quantity, setQuantity]             = useState("");
  const [shipping, setShipping]             = useState("0");
  const [photo, setPhoto]                   = useState(null);
  const [photoPreview, setPhotoPreview]     = useState(null);
  const [categories, setCategories]         = useState([]);
  const [loading, setLoading]               = useState(false);

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
      const { data } = await axios.post("/api/v1/product/create-product", formData, {
        headers: { Authorization: auth?.token, "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Product created successfully!");
        setTimeout(() => navigate("/admin/products"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page py-4">
      <style>{styles}</style>
      <Toaster position="top-right" />

      <div className="container-fluid px-4">
        <div className="row g-3">

          {/* Sidebar */}
          <div className="col-md-3 col-lg-2">
            <AdminMenu />
          </div>

          {/* Content */}
          <div className="col-md-9 col-lg-10">

            {/* Header */}
            <div className="cp-header">
              <div>
                <h2>Create Product</h2>
                <p>Add a new product to your store</p>
              </div>
              <span className="cp-admin-chip">Admin</span>
            </div>

            <div className="card cp-card">

              {/* Banner */}
              <div className="cp-banner">
                <div className="cp-banner-icon">📦</div>
                <div>
                  <h3>New Product Listing</h3>
                  <p>Fill in the details below to list your product</p>
                </div>
              </div>

              <div className="card-body p-4">
                <Form onSubmit={handleSubmit}>
                  <div className="row g-3">

                    {/* ── Photo ── */}
                    <div className="col-12">
                      <div className="cp-section">Product Photo</div>
                      <div
                        className="cp-photo-zone"
                        onClick={() => document.getElementById("cp-photo-input").click()}
                      >
                        {photoPreview ? (
                          <img src={photoPreview} alt="preview" className="cp-photo-preview" />
                        ) : (
                          <>
                            <div className="cp-photo-icon">📷</div>
                            <h6>Click to upload photo</h6>
                            <p>JPG, PNG, WEBP — max 1MB</p>
                          </>
                        )}
                      </div>
                      <Form.Control
                        id="cp-photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        style={{ display: "none" }}
                      />
                      {photo && (
                        <div className="mt-2 d-flex align-items-center justify-content-between">
                          <small style={{ color: "#888", fontSize: "0.73rem" }}>{photo.name}</small>
                          <button
                            type="button"
                            className="cp-remove-btn"
                            onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Basic Info ── */}
                    <div className="col-12 mt-2">
                      <div className="cp-section">Basic Info</div>
                    </div>

                    <div className="col-12">
                      <label className="cp-label">Product Name <span>*</span></label>
                      <input
                        className="cp-input form-control"
                        type="text"
                        placeholder="e.g. Nike Air Max Running Shoes"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="cp-label">Description <span>*</span></label>
                      <textarea
                        className="cp-textarea form-control"
                        rows={4}
                        placeholder="Describe your product..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    {/* ── Pricing ── */}
                    <div className="col-12 mt-2">
                      <div className="cp-section">Pricing & Inventory</div>
                    </div>

                    <div className="col-md-6">
                      <label className="cp-label">Price (₹) <span>*</span></label>
                      <div className="cp-input-wrap">
                        <span className="cp-prefix">₹</span>
                        <input
                          className="cp-input form-control with-prefix"
                          type="number"
                          placeholder="0"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="cp-label">Quantity <span>*</span></label>
                      <input
                        className="cp-input form-control"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="cp-label">Category <span>*</span></label>
                      <Form.Select
                        className="cp-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </Form.Select>
                    </div>

                    <div className="col-md-6">
                      <label className="cp-label">Shipping Available</label>
                      <div className="cp-ship-opts">
                        <div
                          className={`cp-ship-opt ${shipping === "1" ? "yes" : ""}`}
                          onClick={() => setShipping("1")}
                        >
                          ✔ Yes — Free
                        </div>
                        <div
                          className={`cp-ship-opt ${shipping === "0" ? "no" : ""}`}
                          onClick={() => setShipping("0")}
                        >
                          ✘ No
                        </div>
                      </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="col-12 d-flex gap-3 mt-2">
                      <button type="submit" className="cp-submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" />
                            Creating...
                          </>
                        ) : (
                          <>🚀 Create Product</>
                        )}
                      </button>
                      <button
                        type="button"
                        className="cp-cancel"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                </Form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;