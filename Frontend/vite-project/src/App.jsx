import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import NotFound from './pages/NotFound'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/password/ForgotPassword'
import VerifyOtp from './pages/password/VerifyOtp'
import ResetPassword from './pages/password/ResetPassword'
import Private from './components/Routes/Private'
import Dashboard from './pages/user/Dashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminRoute from './components/Routes/AdminRoute'
import CreateCategory from './pages/Admin/CreateCategory'
import CreateProduct from './pages/Admin/CreateProduct'
import Products from './pages/Admin/Products'
import Users from './pages/Admin/Users'
import Orders from './pages/user/Orders'
import Profile from './pages/user/Profile'
import AdminSingleProduct from './pages/Admin/Singleproduct'
import UpdateProduct from './pages/Admin/Updateproduct'
import Cart from './pages/Cart'
import SingleProduct from './pages/SingleProduct'
import SearchPage from './pages/SearchPage'
import CategoryPage from './pages/CategoryPage'   // ✅ 1. Import add kela

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* ===== Public Routes ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:slug" element={<SingleProduct />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />  {/* ✅ 2. Route add kela */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />

          {/* ===== Private Routes ===== */}
        {/* ===== Private Routes ===== */}
<Route path="/dashboard" element={<Private />}>
  <Route index element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
  <Route path="orders" element={<Orders />} />  {/* ✅ Correct path */}
</Route>

          {/* ===== Admin Routes ===== */}
          <Route path="/admin/dashboard" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/admin/create-category" element={<AdminRoute />}>
            <Route index element={<CreateCategory />} />
          </Route>

          <Route path="/admin/create-product" element={<AdminRoute />}>
            <Route index element={<CreateProduct />} />
          </Route>

          <Route path="/admin/products" element={<AdminRoute />}>
            <Route index element={<Products />} />
          </Route>

          <Route path="/admin/product/:slug" element={<AdminRoute />}>
            <Route index element={<AdminSingleProduct />} />
          </Route>

          <Route path="/admin/update-product/:pid" element={<AdminRoute />}>
            <Route index element={<UpdateProduct />} />
          </Route>

          <Route path="/admin/users" element={<AdminRoute />}>
            <Route index element={<Users />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App