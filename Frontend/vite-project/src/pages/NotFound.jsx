import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container text-center my-5 py-5">
      <h1 style={{ fontSize: "8rem", fontWeight: "bold", color: "#0d6efd" }}>404</h1>
      <h2 className="mb-3">Page Not Found!</h2>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => navigate("/")}
      >
        🏠 Go Back
      </button>
    </div>
  );
}

export default NotFound;