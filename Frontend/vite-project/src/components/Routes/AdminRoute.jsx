// components/Routes/AdminRoute.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
  const { auth } = useAuth();

  // Check if user is logged in and has admin role
  if (auth?.token && auth?.user?.role === "admin") {
    return <Outlet />; // User is admin, show admin dashboard
  } else {
    return <Navigate to="/login" />; // Not admin, redirect to login
  }
}