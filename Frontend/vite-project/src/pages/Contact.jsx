import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .contact-page {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    padding: 2rem 0;
  }

  /* ── Header ── */
  .contact-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .contact-header h2 {
    font-size: 1.5rem; font-weight: 700; color: #111; margin: 0 0 6px;
  }
  .contact-header p { font-size: 0.82rem; color: #888; margin: 0; }

  /* ── Info Card ── */
  .contact-info-card {
    background: #131921;
    border: none !important;
    border-radius: 4px !important;
    overflow: hidden;
    height: 100%;
  }

  .contact-info-banner {
    background: #ff9900;
    padding: 16px 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .contact-info-banner h5 {
    font-size: 0.95rem; font-weight: 700;
    color: #111; margin: 0;
  }

  .contact-info-body { padding: 20px; }

  .contact-info-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid #232f3e;
  }
  .contact-info-item:last-child { border-bottom: none; padding-bottom: 0; }

  .contact-info-icon {
    width: 38px; height: 38px; border-radius: 6px;
    background: rgba(255,153,0,0.12);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #ff9900; font-size: 1rem;
  }

  .contact-info-label {
    font-size: 0.68rem; font-weight: 700; color: #8a9bb0;
    text-transform: uppercase; letter-spacing: 0.07em;
    margin: 0 0 3px; display: block;
  }
  .contact-info-value {
    font-size: 0.85rem; font-weight: 500; color: #fff; margin: 0;
  }

  /* ── Form Card ── */
  .contact-form-card {
    background: #fff;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    overflow: hidden;
  }

  .contact-form-banner {
    background: #131921;
    padding: 16px 22px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 3px solid #ff9900;
  }
  .contact-form-banner-icon {
    width: 38px; height: 38px; border-radius: 6px;
    background: rgba(255,153,0,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
  }
  .contact-form-banner h5 { color: #fff; font-size: 0.95rem; font-weight: 700; margin: 0 0 2px; }
  .contact-form-banner p  { color: #8a9bb0; font-size: 0.72rem; margin: 0; }

  /* Labels */
  .contact-label {
    font-size: 0.7rem; font-weight: 700; color: #444;
    text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 5px;
  }

  /* Inputs */
  .contact-input {
    border: 1px solid #ddd !important;
    border-radius: 3px !important;
    font-size: 0.85rem !important;
    font-family: 'Inter', sans-serif !important;
    transition: border-color .15s, box-shadow .15s !important;
  }
  .contact-input:focus {
    border-color: #ff9900 !important;
    box-shadow: 0 0 0 3px rgba(255,153,0,.15) !important;
  }
  .contact-input::placeholder { color: #bbb !important; }

  /* Submit button */
  .contact-submit-btn {
    background: #ff9900; color: #111;
    border: none; width: 100%; padding: 11px;
    border-radius: 3px; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; transition: background .15s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 6px rgba(255,153,0,.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .contact-submit-btn:hover { background: #e68900; }
  .contact-submit-btn:active { transform: scale(0.99); }
`;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent! Thank you ${form.name} 😊`);
    setForm({ name: "", email: "", message: "" });
  };

  const info = [
    { icon: <FaPhone />,         label: "Phone",   value: "+91 98765 43210"       },
    { icon: <FaEnvelope />,      label: "Email",   value: "shop@myshop.com"       },
    { icon: <FaMapMarkerAlt />,  label: "Address", value: "Pune, Maharashtra, India" },
  ];

  return (
    <div className="contact-page">
      <style>{styles}</style>

      <div className="container">

        {/* Header */}
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="row g-4">

          {/* ── Info Card ── */}
          <div className="col-md-4">
            <div className="card contact-info-card shadow-sm h-100">

              <div className="contact-info-banner">
                <h5>📍 Get in Touch</h5>
              </div>

              <div className="contact-info-body">
                {info.map((item) => (
                  <div className="contact-info-item" key={item.label}>
                    <div className="contact-info-icon">{item.icon}</div>
                    <div>
                      <span className="contact-info-label">{item.label}</span>
                      <p className="contact-info-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── Form Card ── */}
          <div className="col-md-8">
            <div className="card contact-form-card shadow-sm">

              <div className="contact-form-banner">
                <div className="contact-form-banner-icon">📨</div>
                <div>
                  <h5>Send a Message</h5>
                  <p>We'll get back to you within 24 hours</p>
                </div>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">

                    <div className="col-12">
                      <label className="contact-label form-label">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control contact-input"
                        placeholder="e.g. Poonam Gambhire"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="contact-label form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control contact-input"
                        placeholder="e.g. poonam@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="contact-label form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-control contact-input"
                        rows={5}
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="contact-submit-btn">
                        📨 Send Message
                      </button>
                    </div>

                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;