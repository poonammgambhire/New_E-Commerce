// components/Layout/UserMenu.jsx
import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: "/dashboard",         label: "Dashboard",   icon: "📊", end: true },
  { to: "/dashboard/profile", label: "Edit Profile", icon: "✏️" },
  { to: "/dashboard/orders",  label: "My Orders",    icon: "🛒" },
];

function UserMenu() {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #D5D9D9",
        borderRadius: 4,
        boxShadow: "0 2px 4px rgba(15,17,17,.08)",
        overflow: "hidden",
        fontFamily: "'Inter', 'Amazon Ember', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 14,
        color: "#0F1111",
      }}
    >

      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: "#131921",
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15 }}>
          🛒 My<span style={{ color: "#FF9900" }}>Shop</span>
        </p>
        <p style={{ margin: "2px 0 0", color: "#ccc", fontSize: 12 }}>
          User Panel
        </p>
      </div>

      {/* ── Nav Links ── */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {menuItems.map(({ to, label, icon, end }, index) => (
          <li
            key={to}
            style={{ borderTop: index === 0 ? "none" : "1px solid #e7e7e7" }}
          >
            <NavLink
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                color: "#0F1111",
                backgroundColor: isActive ? "#fff3cd" : "transparent",
                borderLeft: isActive ? "3px solid #FF9900" : "3px solid transparent",
                transition: "background-color 0.1s",
              })}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default UserMenu;