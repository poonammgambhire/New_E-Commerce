import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/Layout/AdminMenu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .cat-page {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }

  .cat-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .cat-header h2 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 0 0 2px; }
  .cat-header p  { font-size: 0.76rem; color: #888; margin: 0; }
  .cat-count {
    background: #ff9900; color: #111;
    font-size: 0.75rem; font-weight: 700;
    padding: 5px 14px; border-radius: 3px;
  }

  .cat-create-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  .cat-create-banner {
    background: #131921;
    color: #fff;
    padding: 13px 16px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex; align-items: center; gap: 8px;
  }
  .cat-create-banner span { color: #ff9900; }
  .cat-create-body { padding: 16px; }

  .cat-f-label {
    font-size: 0.7rem; font-weight: 700; color: #555;
    text-transform: uppercase; letter-spacing: 0.05em;
    display: block; margin-bottom: 5px;
  }

  .cat-f-input {
    width: 100%; padding: 9px 12px;
    border: 1px solid #ddd; border-radius: 3px;
    font-size: 0.85rem; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .cat-f-input:focus {
    border-color: #ff9900;
    box-shadow: 0 0 0 3px rgba(255,153,0,.15);
  }

  .cat-create-btn {
    width: 100%; margin-top: 12px;
    background: #ff9900; color: #111;
    border: none; padding: 10px;
    border-radius: 3px; font-size: 0.85rem; font-weight: 700;
    cursor: pointer; transition: background .15s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 5px rgba(255,153,0,.4);
  }
  .cat-create-btn:hover { background: #e68900; }
  .cat-create-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .cat-hint { font-size: 0.7rem; color: #aaa; margin-top: 8px; margin-bottom: 0; }

  .cat-list-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  .cat-list-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px; border-bottom: 1px solid #f0f0f0;
    flex-wrap: wrap; gap: 8px;
  }
  .cat-list-head span { font-size: 0.88rem; font-weight: 700; color: #111; }

  .cat-search-wrap { position: relative; }
  .cat-search-wrap svg { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); }
  .cat-search {
    padding: 7px 12px 7px 30px;
    border: 1px solid #ddd; border-radius: 3px;
    font-size: 0.8rem; font-family: 'Inter', sans-serif;
    outline: none; width: 210px; transition: border-color .15s;
  }
  .cat-search:focus { border-color: #ff9900; }

  .cat-table { width: 100%; border-collapse: collapse; }
  .cat-table thead tr { background: #f8f8f8; border-bottom: 1px solid #eee; }
  .cat-table thead th {
    padding: 10px 14px;
    font-size: 0.68rem; font-weight: 700; color: #888;
    text-transform: uppercase; letter-spacing: 0.06em; text-align: left;
  }
  .cat-table tbody td {
    padding: 11px 14px; font-size: 0.83rem; color: #111;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
  }
  .cat-table tbody tr:hover td { background: #fffbf2; }
  .cat-table tbody tr:last-child td { border: none; }

  .cat-slug {
    font-size: 0.72rem; color: #888;
    background: #f5f5f5; padding: 2px 7px;
    border-radius: 3px; font-family: monospace;
  }

  .btn-edit-cat {
    background: linear-gradient(135deg, #2874f0, #1a5dc8);
    color: #fff; border: none;
    font-size: 0.72rem; font-weight: 600;
    padding: 6px 14px; border-radius: 3px;
    cursor: pointer; transition: all .18s;
    box-shadow: 0 2px 5px rgba(40,116,240,.3);
    font-family: 'Inter', sans-serif;
  }
  .btn-edit-cat:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(40,116,240,.45);
    color: #fff;
  }

  .btn-del-cat {
    background: linear-gradient(135deg, #ff6161, #e03c3c);
    color: #fff; border: none;
    font-size: 0.72rem; font-weight: 600;
    padding: 6px 14px; border-radius: 3px;
    cursor: pointer; transition: all .18s;
    box-shadow: 0 2px 5px rgba(224,60,60,.25);
    font-family: 'Inter', sans-serif;
  }
  .btn-del-cat:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(224,60,60,.4);
    color: #fff;
  }

  .cat-empty { text-align: center; padding: 3rem 0; color: #aaa; }
  .cat-empty-icon { font-size: 2.5rem; margin-bottom: 8px; }
  .cat-empty p { font-size: 0.85rem; margin: 0; }
`;

const CreateCategory = () => {
  const { auth } = useAuth();

  const [name, setName]                       = useState("");
  const [categories, setCategories]           = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [fetching, setFetching]               = useState(true);
  const [editId, setEditId]                   = useState(null);
  const [editName, setEditName]               = useState("");
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [search, setSearch]                   = useState("");
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ✅ FIX: auth?.token directly use kiya
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/v1/category/create-category",
        { name: name.trim() },
        { headers: { Authorization: auth?.token } }  // ✅
      );
      if (data.success) {
        toast.success("Category created!");
        setName("");
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: auth?.token directly use kiya
  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("Name cannot be empty");
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${editId}`,
        { name: editName.trim() },
        { headers: { Authorization: auth?.token } }  // ✅
      );
      if (data.success) {
        toast.success("Category updated!");
        setShowEditModal(false);
        setEditId(null);
        setEditName("");
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ✅ FIX: auth?.token directly use kiya
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${deleteTarget._id}`,
        { headers: { Authorization: auth?.token } }  // ✅
      );
      if (data.success) {
        toast.success("Category deleted!");
        fetchCategories();
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

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cat-page py-4">
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
            <div className="cat-header">
              <div>
                <h2>Manage Categories</h2>
                <p>Create, edit, and delete product categories</p>
              </div>
              <span className="cat-count">{categories.length} Total</span>
            </div>

            <div className="row g-3 align-items-start">

              {/* Create Form */}
              <div className="col-12 col-lg-4">
                <div className="cat-create-card">
                  <div className="cat-create-banner">
                    <span>+</span> Add New Category
                  </div>
                  <div className="cat-create-body">
                    <label className="cat-f-label">Category Name</label>
                    <input
                      className="cat-f-input"
                      type="text"
                      placeholder="e.g. Electronics, Fashion..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate(e)}
                    />
                    <button
                      className="cat-create-btn"
                      onClick={handleCreate}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Category"}
                    </button>
                    <p className="cat-hint">A URL-friendly slug will be auto-generated.</p>
                  </div>
                </div>
              </div>

              {/* Category List */}
              <div className="col-12 col-lg-8">
                <div className="cat-list-card">
                  <div className="cat-list-head">
                    <span>All Categories</span>
                    <div className="cat-search-wrap">
                      <svg width="13" height="13" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <input
                        className="cat-search"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {fetching ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" size="sm" style={{ color: "#ff9900" }} />
                      <p className="text-muted mt-2 mb-0 small">Loading categories...</p>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="cat-empty">
                      <div className="cat-empty-icon">📭</div>
                      <p>{search ? `No results for "${search}"` : "No categories yet. Create one!"}</p>
                    </div>
                  ) : (
                    <table className="cat-table">
                      <thead>
                        <tr>
                          <th style={{ width: 44 }}>#</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th style={{ textAlign: "right", paddingRight: 16 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((cat, i) => (
                          <tr key={cat._id}>
                            <td style={{ color: "#bbb", fontSize: "0.72rem", fontWeight: 600 }}>
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td style={{ fontWeight: 600 }}>{cat.name}</td>
                            <td><span className="cat-slug">{cat.slug}</span></td>
                            <td style={{ textAlign: "right", paddingRight: 16 }}>
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn-edit-cat"
                                  onClick={() => {
                                    setEditId(cat._id);
                                    setEditName(cat.name);
                                    setShowEditModal(true);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn-del-cat"
                                  onClick={() => {
                                    setDeleteTarget(cat);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="text-muted small">Category Name</Form.Label>
            <Form.Control
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              autoFocus
              placeholder="Enter new name..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <button className="btn-edit-cat" style={{ padding: "8px 20px" }} onClick={handleUpdate}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <button className="btn-del-cat" style={{ padding: "8px 20px" }} onClick={handleDelete}>
            Yes, Delete
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default CreateCategory;