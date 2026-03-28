import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .adash-root {
    background: #f3f3f3;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }

  .adash-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .adash-sidebar {
    background: #131921;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .adash-sb-logo {
    padding: 16px 18px;
    border-bottom: 1px solid #2d3748;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .adash-sb-logo-box {
    background: #ff9900;
    color: #131921;
    font-weight: 800;
    font-size: 0.78rem;
    padding: 5px 10px;
    border-radius: 3px;
    letter-spacing: 0.04em;
  }

  .adash-sb-logo-text {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .adash-sb-section {
    padding: 12px 18px 4px;
    font-size: 0.62rem;
    font-weight: 700;
    color: #8a9bb0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .adash-sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 18px;
    font-size: 0.82rem;
    color: #d5d9e0;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    text-decoration: none;
    border-left: 3px solid transparent;
  }

  .adash-sb-item:hover {
    background: #232f3e;
    color: #ff9900;
    border-left-color: #ff9900;
  }

  .adash-sb-item.active {
    background: #232f3e;
    color: #ff9900;
    border-left-color: #ff9900;
  }

  .adash-sb-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .adash-sb-item:hover .adash-sb-icon,
  .adash-sb-item.active .adash-sb-icon { opacity: 1; }

  /* ── Main ── */
  .adash-main { background: #f3f3f3; padding: 24px; }

  /* ── Topbar ── */
  .adash-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .adash-topbar h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 2px;
  }

  .adash-topbar p { font-size: 0.76rem; color: #888; margin: 0; }

  .adash-admin-info { display: flex; align-items: center; gap: 10px; }

  .adash-admin-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #ff9900;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    color: #131921;
    flex-shrink: 0;
  }

  .adash-admin-name { font-size: 0.82rem; font-weight: 600; color: #111; text-align: right; }
  .adash-admin-role { font-size: 0.7rem; color: #888; text-align: right; }

  /* ── Stats ── */
  .adash-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .adash-stat {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: box-shadow 0.18s;
  }

  .adash-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }

  .adash-stat-icon-box {
    width: 46px;
    height: 46px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .adash-stat-num {
    font-size: 1.4rem;
    font-weight: 700;
    color: #111;
    line-height: 1;
  }

  .adash-stat-label {
    font-size: 0.7rem;
    color: #888;
    margin-top: 3px;
    font-weight: 500;
  }

  .adash-stat-trend {
    font-size: 0.68rem;
    font-weight: 600;
    margin-top: 3px;
  }

  .trend-up { color: #067d62; }
  .trend-dn { color: #c0392b; }

  /* ── Two col ── */
  .adash-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ── Dash Card ── */
  .adash-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
  }

  .adash-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .adash-card-head span {
    font-size: 0.88rem;
    font-weight: 700;
    color: #111;
  }

  .adash-view-all {
    font-size: 0.75rem;
    color: #0066c0;
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
  }

  .adash-view-all:hover { text-decoration: underline; }

  /* ── Quick Actions ── */
  .adash-quick-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 14px;
  }

  .adash-quick-item {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-decoration: none;
  }

  .adash-quick-item:hover {
    border-color: #ff9900;
    background: #fffbf2;
  }

  .adash-quick-icon {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .adash-quick-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #111;
  }

  .adash-quick-sub {
    font-size: 0.68rem;
    color: #888;
    margin-top: 1px;
  }

  /* ── Orders Table ── */
  .adash-orders-table { width: 100%; border-collapse: collapse; }

  .adash-orders-table th {
    padding: 9px 14px;
    font-size: 0.68rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #f0f0f0;
    text-align: left;
  }

  .adash-orders-table td {
    padding: 10px 14px;
    font-size: 0.8rem;
    color: #111;
    border-bottom: 1px solid #f8f8f8;
  }

  .adash-orders-table tr:last-child td { border: none; }
  .adash-orders-table tbody tr:hover td { background: #fafafa; }

  .adash-status {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 12px;
  }

  .s-delivered { background: #e6f5ef; color: #067d62; }
  .s-pending   { background: #fff8e8; color: #b7791f; }
  .s-cancelled { background: #fce8e8; color: #c0392b; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .adash-layout    { grid-template-columns: 1fr; }
    .adash-sidebar   { position: static; height: auto; }
    .adash-stats     { grid-template-columns: repeat(2, 1fr); }
    .adash-two-col   { grid-template-columns: 1fr; }
    .adash-quick-grid{ grid-template-columns: 1fr 1fr; }
  }
`

const IconDashboard = () => (
  <svg className="adash-sb-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconProduct = () => (
  <svg className="adash-sb-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
)
const IconCategory = () => (
  <svg className="adash-sb-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const IconOrders = () => (
  <svg className="adash-sb-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const IconUsers = () => (
  <svg className="adash-sb-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

function AdminDashboard() {
  const { auth } = useAuth()

  // ✅ Real data states
  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ Real API calls
  const fetchStats = async () => {
    try {
      const headers = { Authorization: auth?.token }

      const [productRes, orderRes, userRes, allOrdersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API}/api/v1/product/product-count`),
        axios.get(`${import.meta.env.VITE_API}/api/v1/orders/dashboard-stats`, { headers }),
        axios.get(`${import.meta.env.VITE_API}/api/v1/auth/all-users`, { headers }),
        axios.get(`${import.meta.env.VITE_API}/api/v1/orders/all-orders`, { headers }),
      ])

      setStatsData({
        totalProducts: productRes.data?.count || 0,
        totalOrders: orderRes.data?.stats?.totalOrders || 0,
        totalUsers: userRes.data?.users?.length || 0,
        totalRevenue: orderRes.data?.stats?.totalRevenue || 0,
      })

      // Latest 4 orders only
      setRecentOrders(allOrdersRes.data?.orders?.slice(0, 4) || [])

    } catch (error) {
      console.log("Stats fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Real stats cards
  const stats = [
    { icon: '📦', label: 'Total Products',   value: loading ? '...' : statsData.totalProducts, bg: '#fff8e8', trend: '↑ Products', up: true },
    { icon: '🛒', label: 'Total Orders',     value: loading ? '...' : statsData.totalOrders,   bg: '#e6f5ef', trend: '↑ Orders',   up: true },
    { icon: '👥', label: 'Registered Users', value: loading ? '...' : statsData.totalUsers,    bg: '#e8f0fe', trend: '↑ Users',    up: true },
    { icon: '💰', label: 'Total Revenue',    value: loading ? '...' : `₹${statsData.totalRevenue.toLocaleString('en-IN')}`, bg: '#fce8ff', trend: '↑ Revenue', up: true },
  ]

  const quickActions = [
    { icon: '📦', label: 'All Products', sub: 'View all listings', to: '/admin/products',        bg: '#fff8e8' },
    { icon: '🏷️', label: 'Categories',  sub: 'Manage catalog',    to: '/admin/create-category', bg: '#e6f5ef' },
    { icon: '👥', label: 'View Users',   sub: 'All accounts',      to: '/admin/users',           bg: '#e8f0fe' },
    { icon: '🛒', label: 'Orders',       sub: 'Track & manage',    to: '/admin/orders',          bg: '#fce8e8' },
  ]

  const statusClass = {
    Processing: 's-pending',
    Shipped:    's-pending',
    Delivered:  's-delivered',
    Cancelled:  's-cancelled',
  }

  return (
    <div className="adash-root">
      <style>{styles}</style>

      <div className="adash-layout">

        {/* Sidebar */}
        <aside className="adash-sidebar">
          <div className="adash-sb-logo">
            <div className="adash-sb-logo-box">seller</div>
            <span className="adash-sb-logo-text">Central</span>
          </div>

          <div className="adash-sb-section">Main</div>
          <Link to="/admin/dashboard" className="adash-sb-item active">
            <IconDashboard /> Dashboard
          </Link>

          <div className="adash-sb-section">Catalog</div>
          <Link to="/admin/products" className="adash-sb-item">
            <IconProduct /> All Products
          </Link>
          <Link to="/admin/create-product" className="adash-sb-item">
            <IconProduct /> Create Product
          </Link>
          <Link to="/admin/create-category" className="adash-sb-item">
            <IconCategory /> Categories
          </Link>

          <div className="adash-sb-section">Orders</div>
          <Link to="/admin/orders" className="adash-sb-item">
            <IconOrders /> Orders
          </Link>

          <div className="adash-sb-section">People</div>
          <Link to="/admin/users" className="adash-sb-item">
            <IconUsers /> Users
          </Link>
        </aside>

        {/* Main */}
        <main className="adash-main">

          {/* Topbar */}
          <div className="adash-topbar">
            <div>
              <h2>Welcome back, {auth?.user?.name || 'Admin'} 👋</h2>
              <p>Here's what's happening in your store today</p>
            </div>
            <div className="adash-admin-info">
              <div>
                <div className="adash-admin-name">{auth?.user?.name || 'Admin'}</div>
                <div className="adash-admin-role">{auth?.user?.email || ''}</div>
              </div>
              <div className="adash-admin-avatar">
                {auth?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>

          {/* ✅ Real Stats */}
          <div className="adash-stats">
            {stats.map(s => (
              <div className="adash-stat" key={s.label}>
                <div className="adash-stat-icon-box" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <div className="adash-stat-num">{s.value}</div>
                  <div className="adash-stat-label">{s.label}</div>
                  <div className={`adash-stat-trend ${s.up ? 'trend-up' : 'trend-dn'}`}>
                    {s.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two col */}
          <div className="adash-two-col">

            {/* Quick Actions */}
            <div className="adash-card">
              <div className="adash-card-head">
                <span>Quick Actions</span>
              </div>
              <div className="adash-quick-grid">
                {quickActions.map(q => (
                  <Link to={q.to} className="adash-quick-item" key={q.label}>
                    <div className="adash-quick-icon" style={{ background: q.bg }}>
                      {q.icon}
                    </div>
                    <div>
                      <div className="adash-quick-label">{q.label}</div>
                      <div className="adash-quick-sub">{q.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ Real Recent Orders */}
            <div className="adash-card">
              <div className="adash-card-head">
                <span>Recent Orders</span>
                <Link to="/admin/orders" className="adash-view-all">View all →</Link>
              </div>
              <table className="adash-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                        Loading...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontWeight: 600 }}>#{o._id.slice(-4).toUpperCase()}</td>
                        <td>{o.buyer?.name || 'N/A'}</td>
                        <td style={{ fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`adash-status ${statusClass[o.status] || 's-pending'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard