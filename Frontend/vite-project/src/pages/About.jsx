import React from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .about-root {
    background: #e3e6e6;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0f1111;
  }

  /* Hero */
  .about-hero {
    background: #131921;
    color: #fff;
    padding: 48px 0 40px;
    text-align: center;
  }

  .about-hero h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  .about-hero h1 span { color: #f90; }

  .about-hero p {
    font-size: 1rem;
    color: #adb5bd;
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Cards */
  .about-card {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 8px;
  }

  .about-card h2 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f90;
    display: inline-block;
  }

  .about-card p {
    font-size: 13.5px;
    color: #333;
    line-height: 1.7;
    margin-bottom: 12px;
  }

  /* Stats */
  .about-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #ddd;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .about-stat {
    background: #fff;
    padding: 20px 16px;
    text-align: center;
  }

  .about-stat-num {
    font-size: 1.8rem;
    font-weight: 700;
    color: #f90;
    line-height: 1;
    margin-bottom: 4px;
  }

  .about-stat-label {
    font-size: 12px;
    color: #565959;
  }

  /* Features grid */
  .about-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 8px;
  }

  .about-feature {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
  }

  .about-feature-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .about-feature h6 {
    font-weight: 700;
    font-size: 0.88rem;
    margin-bottom: 6px;
  }

  .about-feature p {
    font-size: 12px;
    color: #565959;
    margin: 0;
    line-height: 1.5;
  }

  /* Timeline */
  .about-timeline { position: relative; padding-left: 24px; }
  .about-timeline::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #f90;
  }

  .about-tl-item {
    position: relative;
    margin-bottom: 20px;
  }

  .about-tl-item::before {
    content: '';
    position: absolute;
    left: -21px;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f90;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #f90;
  }

  .about-tl-year {
    font-size: 11px;
    font-weight: 700;
    color: #f90;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .about-tl-text {
    font-size: 13px;
    color: #333;
    line-height: 1.5;
  }

  /* Team */
  .about-team {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .about-team-card {
    text-align: center;
    background: #fff;
    border-radius: 4px;
    padding: 20px 12px;
    border: 1px solid #f0f0f0;
  }

  .about-team-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #131921;
    color: #f90;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 auto 10px;
  }

  .about-team-name { font-weight: 600; font-size: 0.88rem; margin-bottom: 2px; }
  .about-team-role { font-size: 11px; color: #007185; }

  /* CTA */
  .about-cta {
    background: #131921;
    color: #fff;
    padding: 32px;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 8px;
  }

  .about-cta h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
  .about-cta p { font-size: 13px; color: #adb5bd; margin-bottom: 16px; }

  .about-cta-btn {
    background: #ffd814;
    border: 1px solid #fcd200;
    border-radius: 20px;
    padding: 8px 28px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: #0f1111;
    transition: background 0.15s;
  }

  .about-cta-btn:hover { background: #f7ca00; }

  /* Info table */
  .about-info-table { width: 100%; font-size: 13px; }
  .about-info-table tr { border-bottom: 1px solid #f0f0f0; }
  .about-info-table tr:last-child { border-bottom: none; }
  .about-info-table td { padding: 8px 0; }
  .about-info-table td:first-child { color: #565959; width: 40%; }
  .about-info-table td:last-child { font-weight: 500; color: #0f1111; }

  @media (max-width: 768px) {
    .about-stats { grid-template-columns: repeat(2, 1fr); }
    .about-features { grid-template-columns: repeat(2, 1fr); }
    .about-team { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 480px) {
    .about-features { grid-template-columns: 1fr; }
    .about-team { grid-template-columns: 1fr; }
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-root">
      <style>{styles}</style>

      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <h1>About <span>MyShop</span></h1>
          <p>
            India's trusted online shopping destination — bringing millions of products
            to your doorstep with speed, reliability, and unbeatable prices.
          </p>
        </div>
      </div>

      <div className="container py-3">

        {/* Stats */}
        <div className="about-stats">
          <div className="about-stat">
            <div className="about-stat-num">10L+</div>
            <div className="about-stat-label">Happy Customers</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-num">50K+</div>
            <div className="about-stat-label">Products Listed</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-label">Cities Served</div>
            <div className="about-stat-num">500+</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-num">4.8★</div>
            <div className="about-stat-label">Average Rating</div>
          </div>
        </div>

        {/* Our Story */}
        <div className="about-card">
          <h2>Our Story</h2>
          <p>
            MyShop was founded with a simple mission — make quality products accessible
            to every Indian household. What started as a small startup in 2020 has grown
            into one of India's fastest-growing e-commerce platforms.
          </p>
          <p>
            We believe shopping should be simple, safe, and satisfying. That's why we work
            with thousands of trusted sellers across the country to bring you authentic
            products at the best prices, delivered right to your door.
          </p>
          <p>
            Today, MyShop serves customers across 500+ cities with a catalog spanning
            electronics, fashion, home & kitchen, books, sports, and much more.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="about-features">
          {[
            { icon: "🚀", title: "Fast Delivery", desc: "Same-day and next-day delivery available in 100+ cities across India." },
            { icon: "🔒", title: "Secure Payments", desc: "256-bit SSL encryption. Pay with UPI, cards, net banking, or Cash on Delivery." },
            { icon: "↩️", title: "Easy Returns", desc: "10-day hassle-free return policy on most products. No questions asked." },
            { icon: "✅", title: "100% Authentic", desc: "Every product is verified. We partner only with trusted, certified sellers." },
            { icon: "🎧", title: "24/7 Support", desc: "Our customer care team is available round the clock to help you." },
            { icon: "💰", title: "Best Prices", desc: "Price match guarantee. Find it cheaper elsewhere — we'll match it." },
          ].map((f, i) => (
            <div className="about-feature" key={i}>
              <div className="about-feature-icon">{f.icon}</div>
              <h6>{f.title}</h6>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="about-card">
          <h2>Our Journey</h2>
          <div className="about-timeline">
            {[
              { year: "2020", text: "MyShop founded — launched with 500 products and 3 categories." },
              { year: "2021", text: "Expanded to 50,000+ products. Introduced same-day delivery in metro cities." },
              { year: "2022", text: "Crossed 1 lakh happy customers. Launched MyShop Prime membership." },
              { year: "2023", text: "Expanded to 500+ cities. Introduced seller marketplace with 1,000+ verified sellers." },
              { year: "2024", text: "Launched MyShop app with 5M+ downloads. Introduced AI-powered recommendations." },
            ].map((item, i) => (
              <div className="about-tl-item" key={i}>
                <div className="about-tl-year">{item.year}</div>
                <div className="about-tl-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="about-card">
          <h2>Leadership Team</h2>
          <div className="about-team">
            {[
              { name: "Rahul Sharma", role: "CEO & Co-Founder", initial: "RS" },
              { name: "Priya Patel", role: "CTO & Co-Founder", initial: "PP" },
              { name: "Amit Verma", role: "Head of Operations", initial: "AV" },
            ].map((m, i) => (
              <div className="about-team-card" key={i}>
                <div className="about-team-avatar">{m.initial}</div>
                <div className="about-team-name">{m.name}</div>
                <div className="about-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="about-card">
          <h2>Company Information</h2>
          <table className="about-info-table">
            <tbody>
              <tr><td>Company Name</td><td>MyShop India Pvt. Ltd.</td></tr>
              <tr><td>Founded</td><td>2020</td></tr>
              <tr><td>Headquarters</td><td>Mumbai, Maharashtra, India</td></tr>
              <tr><td>Industry</td><td>E-Commerce / Retail</td></tr>
              <tr><td>Employees</td><td>500+</td></tr>
              <tr><td>CIN</td><td>U52100MH2020PTC123456</td></tr>
              <tr><td>GST No.</td><td>27AABCM1234A1Z5</td></tr>
              <tr><td>Email</td><td>support@myshop.in</td></tr>
              <tr><td>Phone</td><td>1800-123-4567 (Toll Free)</td></tr>
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h3>Start Shopping Today</h3>
          <p>Discover millions of products at the best prices with fast delivery.</p>
          <button className="about-cta-btn" onClick={() => navigate("/")}>
            Shop Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;