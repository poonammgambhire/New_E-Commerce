import React from "react";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  loading = false,
}) => {
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="input-group">

        {/* Text Input */}
        <input
          type="text"
          className="form-control"
          placeholder="Enter category name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          required
          style={{
            height: 36,
            fontSize: 13,
            border: "1px solid #888C8C",
            borderRadius: "3px 0 0 3px",
            boxShadow: "0 1px 2px rgba(213,217,217,.5)",
            color: "#0F1111",
            padding: "3px 10px",
            fontFamily: "'Inter', 'Amazon Ember', sans-serif",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="d-flex align-items-center gap-2"
          style={{
            padding: "0 16px",
            height: 36,
            background: loading
              ? "#f5d78e"
              : "linear-gradient(to bottom, #f7dfa5, #f0c14b)",
            border: "1px solid #a88734",
            borderLeft: "none",
            borderBottomColor: "#9c7e31",
            borderRadius: "0 3px 3px 0",
            color: "#111",
            fontSize: 13,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
            whiteSpace: "nowrap",
            fontFamily: "'Inter', 'Amazon Ember', sans-serif",
          }}
        >
          {loading ? (
            <>
              <span
                className="spinner-border"
                role="status"
                style={{ width: 12, height: 12, borderWidth: 2 }}
              />
              Saving...
            </>
          ) : (
            buttonText
          )}
        </button>

      </div>
    </form>
  );
};

export default CategoryForm;