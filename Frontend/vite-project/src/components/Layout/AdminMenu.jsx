import { NavLink } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .amenu-wrap {
    background: #131921;
    border-radius: 4px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }

  /* ── Logo / Header ── */
  .amenu-header {
    padding: 14px 16px;
    border-bottom: 1px solid #2d3748;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .amenu-logo-box {
    background: #ff9900;
    color: #131921;
    font-weight: 800;
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 3px;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .amenu-logo-text {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  /* ── Section Label ── */
  .amenu-section {
    padding: 10px 16px 4px;
    font-size: 0.6rem;
    font-weight: 700;
    color: #8a9bb0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* ── Nav Item ── */
  .amenu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    font-size: 0.82rem;
    color: #d5d9e0;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: background 0.12s, color 0.12s, border-color 0.12s;
  }

  .amenu-link:hover {
    background: #232f3e;
    color: #ff9900;
    border-left-color: #ff9900;
    text-decoration: none;
  }

  .amenu-link.active {
    background: #232f3e;
    color: #ff9900;
    border-left-color: #ff9900;
    font-weight: 600;
  }

  .amenu-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .amenu-link:hover .amenu-icon,
  .amenu-link.active .amenu-icon {
    opacity: 1;
  }

  /* ── Bottom ── */
  .amenu-footer {
    padding: 12px 16px;
    border-top: 1px solid #2d3748;
    font-size: 0.68rem;
    color: #4a5568;
    text-align: center;
  }
`

// ── SVG Icons ──────────────────────────────────────────────────
const IconDashboard = () => (
  <svg className="amenu-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconCategory = () => (
  <svg className="amenu-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const IconProductAdd = () => (
  <svg className="amenu-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const IconProducts = () => (
  <svg className="amenu-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
)
const IconUsers = () => (
  <svg className="amenu-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

function AdminMenu() {
  return (
    <div className="amenu-wrap">
      <style>{styles}</style>

      {/* Header */}
      <div className="amenu-header">
        <div className="amenu-logo-box">seller</div>
        <span className="amenu-logo-text">Central</span>
      </div>

      {/* Main */}
      <div className="amenu-section">Main</div>
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) => `amenu-link ${isActive ? 'active' : ''}`}
      >
        <IconDashboard /> Dashboard
      </NavLink>

      {/* Catalog */}
      <div className="amenu-section">Catalog</div>
      <NavLink
        to="/admin/create-category"
        className={({ isActive }) => `amenu-link ${isActive ? 'active' : ''}`}
      >
        <IconCategory /> Create Category
      </NavLink>
      <NavLink
        to="/admin/create-product"
        className={({ isActive }) => `amenu-link ${isActive ? 'active' : ''}`}
      >
        <IconProductAdd /> Create Product
      </NavLink>
      <NavLink
        to="/admin/products"
        className={({ isActive }) => `amenu-link ${isActive ? 'active' : ''}`}
      >
        <IconProducts /> All Products
      </NavLink>

      {/* People */}
      <div className="amenu-section">People</div>
      <NavLink
        to="/admin/users"
        className={({ isActive }) => `amenu-link ${isActive ? 'active' : ''}`}
      >
        <IconUsers /> All Users
      </NavLink>

      {/* Footer */}
      <div className="amenu-footer">Admin v1.0</div>

    </div>
  )
}

export default AdminMenu