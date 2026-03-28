import React, { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .policy-root {
    background: #e3e6e6;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0f1111;
  }

  .policy-hero {
    background: #131921;
    color: #fff;
    padding: 32px 0;
    text-align: center;
  }

  .policy-hero h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; }
  .policy-hero h1 span { color: #f90; }
  .policy-hero p { font-size: 12px; color: #adb5bd; margin: 0; }

  .policy-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 8px;
    align-items: start;
    padding: 8px 0;
  }

  /* Sidebar nav */
  .policy-nav {
    background: #fff;
    border-radius: 4px;
    padding: 12px 0;
    position: sticky;
    top: 8px;
  }

  .policy-nav-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #565959;
    padding: 0 16px 8px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px;
  }

  .policy-nav-item {
    display: block;
    padding: 8px 16px;
    font-size: 13px;
    color: #0f1111;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s;
    text-decoration: none;
  }

  .policy-nav-item:hover { background: #f7f7f7; color: #c7511f; }
  .policy-nav-item.active { border-left-color: #f90; background: #fffbf0; font-weight: 600; color: #c7511f; }

  /* Content */
  .policy-content { display: flex; flex-direction: column; gap: 8px; }

  .policy-section {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    scroll-margin-top: 16px;
  }

  .policy-section h2 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f90;
    display: inline-block;
  }

  .policy-section p {
    font-size: 13px;
    color: #333;
    line-height: 1.75;
    margin-bottom: 10px;
  }

  .policy-section p:last-child { margin-bottom: 0; }

  .policy-section ul {
    padding-left: 20px;
    margin: 0 0 10px;
  }

  .policy-section ul li {
    font-size: 13px;
    color: #333;
    line-height: 1.7;
    margin-bottom: 4px;
  }

  .policy-section h3 {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0f1111;
    margin: 14px 0 6px;
  }

  /* Highlight box */
  .policy-highlight {
    background: #fffbf0;
    border: 1px solid #fcd200;
    border-radius: 4px;
    padding: 12px 14px;
    font-size: 13px;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.6;
  }

  .policy-highlight strong { color: #c7511f; }

  /* Info table */
  .policy-table {
    width: 100%;
    font-size: 13px;
    border-collapse: collapse;
  }

  .policy-table tr { border-bottom: 1px solid #f0f0f0; }
  .policy-table tr:last-child { border-bottom: none; }
  .policy-table td { padding: 8px 4px; vertical-align: top; }
  .policy-table td:first-child { color: #565959; width: 35%; font-weight: 500; }

  /* Badge */
  .policy-badge {
    display: inline-block;
    background: #f0f7f0;
    color: #007600;
    border: 1px solid #b2dfb2;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    margin-bottom: 10px;
  }

  /* Updated date */
  .policy-updated {
    font-size: 11px;
    color: #565959;
    margin-bottom: 10px;
  }

  /* Contact card */
  .policy-contact {
    background: #f0f2f2;
    border-radius: 4px;
    padding: 14px;
    font-size: 13px;
    line-height: 1.7;
  }

  .policy-contact strong { color: #0f1111; }

  @media (max-width: 768px) {
    .policy-layout { grid-template-columns: 1fr; }
    .policy-nav { position: static; display: flex; overflow-x: auto; padding: 0; gap: 0; }
    .policy-nav-title { display: none; }
    .policy-nav-item { white-space: nowrap; border-left: none; border-bottom: 3px solid transparent; padding: 10px 14px; }
    .policy-nav-item.active { border-bottom-color: #f90; border-left-color: transparent; }
  }
`;

const SECTIONS = [
  { id: "privacy",      label: "Privacy Policy" },
  { id: "collection",   label: "Data We Collect" },
  { id: "usage",        label: "How We Use Data" },
  { id: "sharing",      label: "Data Sharing" },
  { id: "cookies",      label: "Cookies" },
  { id: "security",     label: "Data Security" },
  { id: "rights",       label: "Your Rights" },
  { id: "returns",      label: "Returns & Refunds" },
  { id: "cancellation", label: "Cancellation Policy" },
  { id: "shipping",     label: "Shipping Policy" },
  { id: "grievance",    label: "Grievance Officer" },
];

const Policy = () => {
  const [active, setActive] = useState("privacy");

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="policy-root">
      <style>{styles}</style>

      {/* Hero */}
      <div className="policy-hero">
        <div className="container">
          <h1><span>MyShop</span> Policies</h1>
          <p>Privacy Policy · Returns · Shipping · Cancellation | Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-layout">

          {/* Sidebar */}
          <div className="policy-nav">
            <div className="policy-nav-title">Contents</div>
            {SECTIONS.map((s) => (
              <span
                key={s.id}
                className={`policy-nav-item ${active === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="policy-content">

            {/* Privacy Policy */}
            <div className="policy-section" id="privacy">
              <div className="policy-badge">✔ Verified Policy</div>
              <div className="policy-updated">Last updated: January 1, 2025</div>
              <h2>Privacy Policy</h2>
              <p>
                MyShop India Pvt. Ltd. ("MyShop", "we", "us", or "our") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website or make a purchase.
              </p>
              <p>
                By using our services, you agree to the collection and use of information in accordance
                with this policy. If you do not agree with any part of this policy, please do not use
                our services.
              </p>
              <div className="policy-highlight">
                <strong>Important:</strong> We never sell your personal data to third parties. Your
                information is used solely to provide and improve our services.
              </div>
            </div>

            {/* Data Collection */}
            <div className="policy-section" id="collection">
              <h2>Data We Collect</h2>
              <h3>Information you provide directly:</h3>
              <ul>
                <li>Name, email address, phone number</li>
                <li>Delivery address and billing address</li>
                <li>Payment information (encrypted — we do not store card numbers)</li>
                <li>Account credentials (password stored as encrypted hash)</li>
                <li>Reviews, ratings, and feedback you submit</li>
              </ul>
              <h3>Information collected automatically:</h3>
              <ul>
                <li>IP address, browser type, device information</li>
                <li>Pages visited, products viewed, search queries</li>
                <li>Purchase history and wishlist data</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (only if permission granted)</li>
              </ul>
            </div>

            {/* How We Use */}
            <div className="policy-section" id="usage">
              <h2>How We Use Your Data</h2>
              <table className="policy-table">
                <tbody>
                  <tr><td>Order Processing</td><td>To confirm, process, and deliver your orders</td></tr>
                  <tr><td>Account Management</td><td>To create and manage your MyShop account</td></tr>
                  <tr><td>Customer Support</td><td>To respond to queries, complaints, and returns</td></tr>
                  <tr><td>Personalization</td><td>To show relevant products and recommendations</td></tr>
                  <tr><td>Marketing</td><td>To send offers, deals, and promotional emails (opt-out available)</td></tr>
                  <tr><td>Security</td><td>To detect fraud, abuse, and unauthorized access</td></tr>
                  <tr><td>Legal Compliance</td><td>To comply with applicable laws and regulations</td></tr>
                </tbody>
              </table>
            </div>

            {/* Data Sharing */}
            <div className="policy-section" id="sharing">
              <h2>Data Sharing</h2>
              <p>We share your data only when necessary:</p>
              <ul>
                <li><strong>Delivery Partners</strong> — Name, address, phone number for order delivery</li>
                <li><strong>Payment Gateways</strong> — Razorpay, Paytm (for payment processing only)</li>
                <li><strong>Sellers</strong> — Order details shared with seller to fulfill your order</li>
                <li><strong>Legal Authorities</strong> — If required by law, court order, or government request</li>
                <li><strong>Analytics Tools</strong> — Anonymized data only (Google Analytics, etc.)</li>
              </ul>
              <div className="policy-highlight">
                <strong>We never sell your data.</strong> We do not share your personal information
                with advertisers or any third party for their marketing purposes.
              </div>
            </div>

            {/* Cookies */}
            <div className="policy-section" id="cookies">
              <h2>Cookies Policy</h2>
              <p>We use cookies to enhance your shopping experience:</p>
              <table className="policy-table">
                <tbody>
                  <tr><td>Essential Cookies</td><td>Required for the website to function (login, cart)</td></tr>
                  <tr><td>Preference Cookies</td><td>Remember your settings, language, and location</td></tr>
                  <tr><td>Analytics Cookies</td><td>Help us understand how you use our website</td></tr>
                  <tr><td>Marketing Cookies</td><td>Show relevant ads on other websites (can be disabled)</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 10 }}>
                You can control cookies through your browser settings. Disabling essential cookies
                may affect website functionality.
              </p>
            </div>

            {/* Security */}
            <div className="policy-section" id="security">
              <h2>Data Security</h2>
              <ul>
                <li>256-bit SSL encryption for all data transmission</li>
                <li>PCI-DSS compliant payment processing</li>
                <li>Passwords stored using bcrypt hashing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Two-factor authentication available for accounts</li>
                <li>Data stored on secure, ISO 27001 certified servers in India</li>
              </ul>
              <p>
                Despite our best efforts, no method of transmission over the internet is 100% secure.
                If you suspect unauthorized access to your account, please contact us immediately.
              </p>
            </div>

            {/* Rights */}
            <div className="policy-section" id="rights">
              <h2>Your Rights</h2>
              <p>Under India's Digital Personal Data Protection Act (DPDPA) 2023, you have the right to:</p>
              <ul>
                <li><strong>Access</strong> — Request a copy of your personal data we hold</li>
                <li><strong>Correction</strong> — Update or correct inaccurate personal data</li>
                <li><strong>Deletion</strong> — Request deletion of your account and associated data</li>
                <li><strong>Opt-out</strong> — Unsubscribe from marketing emails at any time</li>
                <li><strong>Portability</strong> — Request your data in a machine-readable format</li>
                <li><strong>Nomination</strong> — Nominate another person to exercise rights on your behalf</li>
              </ul>
              <p>To exercise any of these rights, email us at <strong>privacy@myshop.in</strong></p>
            </div>

            {/* Returns */}
            <div className="policy-section" id="returns">
              <h2>Returns & Refunds Policy</h2>
              <div className="policy-highlight">
                <strong>10-Day Return Policy</strong> — Most products are eligible for return within
                10 days of delivery.
              </div>
              <h3>Eligible for Return:</h3>
              <ul>
                <li>Damaged or defective product received</li>
                <li>Wrong product delivered</li>
                <li>Product not as described</li>
                <li>Missing accessories or parts</li>
              </ul>
              <h3>Not Eligible for Return:</h3>
              <ul>
                <li>Products damaged due to customer misuse</li>
                <li>Digital products and software licenses</li>
                <li>Perishable goods (food, flowers)</li>
                <li>Intimate wear and hygiene products (once opened)</li>
                <li>Items returned after 10 days of delivery</li>
              </ul>
              <h3>Refund Timeline:</h3>
              <table className="policy-table">
                <tbody>
                  <tr><td>UPI / Net Banking</td><td>2–3 business days</td></tr>
                  <tr><td>Credit / Debit Card</td><td>5–7 business days</td></tr>
                  <tr><td>MyShop Wallet</td><td>Instant (within 24 hours)</td></tr>
                  <tr><td>Cash on Delivery</td><td>5–7 business days (NEFT to bank account)</td></tr>
                </tbody>
              </table>
            </div>

            {/* Cancellation */}
            <div className="policy-section" id="cancellation">
              <h2>Cancellation Policy</h2>
              <ul>
                <li>Orders can be cancelled <strong>before they are shipped</strong></li>
                <li>Once shipped, cancellation is not possible — use the return process instead</li>
                <li>To cancel, go to <strong>My Orders → Select Order → Cancel Order</strong></li>
                <li>Refund for cancelled orders is processed within 2–3 business days</li>
                <li>Pre-paid orders: refund credited to original payment method</li>
                <li>COD orders: no charge is made if cancelled before delivery</li>
              </ul>
              <div className="policy-highlight">
                <strong>Note:</strong> MyShop reserves the right to cancel orders due to pricing errors,
                stock unavailability, or suspected fraud. You will be notified and fully refunded.
              </div>
            </div>

            {/* Shipping */}
            <div className="policy-section" id="shipping">
              <h2>Shipping Policy</h2>
              <table className="policy-table">
                <tbody>
                  <tr><td>Standard Delivery</td><td>3–5 business days — FREE on orders above ₹499</td></tr>
                  <tr><td>Express Delivery</td><td>1–2 business days — ₹99 flat</td></tr>
                  <tr><td>Same Day Delivery</td><td>Available in select cities — ₹149</td></tr>
                  <tr><td>Remote Areas</td><td>5–10 business days — additional charges may apply</td></tr>
                </tbody>
              </table>
              <p style={{ marginTop: 10 }}>
                Once your order is shipped, you will receive a tracking number via SMS and email.
                Delivery timelines may vary during sale events, holidays, or due to unforeseen
                circumstances.
              </p>
              <ul>
                <li>We ship to 27,000+ pin codes across India</li>
                <li>International shipping not available currently</li>
                <li>Signature may be required for high-value orders</li>
              </ul>
            </div>

            {/* Grievance */}
            <div className="policy-section" id="grievance">
              <h2>Grievance Officer</h2>
              <p>
                As per the Information Technology (Intermediary Guidelines and Digital Media Ethics Code)
                Rules 2021, the name and contact details of our Grievance Officer are:
              </p>
              <div className="policy-contact">
                <div><strong>Name:</strong> Rahul Sharma</div>
                <div><strong>Designation:</strong> Grievance Officer</div>
                <div><strong>Company:</strong> MyShop India Pvt. Ltd.</div>
                <div><strong>Address:</strong> 4th Floor, Tower B, Bandra Kurla Complex, Mumbai 400051</div>
                <div><strong>Email:</strong> grievance@myshop.in</div>
                <div><strong>Phone:</strong> 1800-123-4567 (Mon–Sat, 9 AM – 6 PM)</div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#565959" }}>
                  Grievances will be acknowledged within 24 hours and resolved within 30 days.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;