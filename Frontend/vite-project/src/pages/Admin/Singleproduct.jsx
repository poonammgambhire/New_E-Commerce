import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Badge, Spinner } from "react-bootstrap";
import AdminMenu from "../../components/Layout/AdminMenu";

const SingleProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/v1/product/get-product/${slug}`);
        if (data.success) setProduct(data.product);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [slug]);

  return (
    <div className="container-fluid py-4">
      <Toaster position="top-right" />

      <div className="row">
        {/* Admin Menu */}
        <div className="col-md-3">
          <AdminMenu />
        </div>

        {/* Content */}
        <div className="col-md-9">

          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/admin/products")}
            >
              ← Back
            </Button>
            <div>
              <h2 className="fw-bold mb-0">Product Detail</h2>
            </div>
          </div>

          {fetching ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : !product ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1">📭</div>
              <p>Product not found.</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="row g-4">

                  {/* Photo */}
                  <div className="col-md-4 text-center">
                    <img
                      src={`${import.meta.env.VITE_API}/uploads/${product.photo}`}
                      alt={product.name}
                      className="img-fluid rounded-3"
                      style={{ maxHeight: 300, objectFit: "cover", width: "100%", background: "#f0f0f0" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="col-md-8">
                    <h3 className="fw-bold mb-2">{product.name}</h3>
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      <Badge bg="secondary">{product.category?.name || "—"}</Badge>
                      <Badge bg={product.shipping ? "success" : "light"} text={product.shipping ? "white" : "dark"}>
                        Shipping: {product.shipping ? "Yes" : "No"}
                      </Badge>
                    </div>

                    <table className="table table-borderless table-sm mb-3">
                      <tbody>
                        <tr>
                          <td className="text-muted" style={{ width: 120 }}>Price</td>
                          <td className="fw-semibold">₹{product.price?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Quantity</td>
                          <td>{product.quantity}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Slug</td>
                          <td><code className="small">{product.slug}</code></td>
                        </tr>
                        <tr>
                          <td className="text-muted">Created</td>
                          <td className="small">{new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mb-3">
                      <p className="text-muted small mb-1">Description</p>
                      <p className="mb-0">{product.description}</p>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <Button
                        variant="dark"
                        onClick={() => navigate(`/admin/update-product/${product._id}`)}
                      >
                        ✏️ Edit Product
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/admin/products")}
                      >
                        Back to List
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;