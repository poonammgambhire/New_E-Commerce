import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Table, Spinner, Badge, InputGroup, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import AdminMenu from "../../components/Layout/AdminMenu";

const Users = () => {
  const { auth } = useAuth();

  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users", {
        headers: { Authorization: auth?.token },
      });
      if (data.success) setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setFetching(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <Toaster position="top-right" />

      <div className="row">
        {/* Admin Menu */}
        <div className="col-md-3">
          <AdminMenu />
        </div>

        {/* Content */}
        <div className="col-md-9">

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold mb-1">All Users</h2>
              <p className="text-muted mb-0">View all registered users</p>
            </div>
            <Badge bg="dark" className="fs-6 px-3 py-2">
              {users.length} Total
            </Badge>
          </div>

          <div className="card shadow-sm">

            {/* Search */}
            <div className="card-header bg-white py-3">
              <InputGroup style={{ maxWidth: 280 }}>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="card-body p-0">
              {fetching ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="secondary" />
                  <p className="text-muted mt-2 small">Loading users...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <div className="fs-1">👥</div>
                  <p className="mb-0">
                    {search ? `No results for "${search}"` : "No users found."}
                  </p>
                </div>
              ) : (
                <Table hover responsive className="mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 50 }}>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user, i) => (
                      <tr key={user._id}>
                        <td className="text-muted small ps-3">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="fw-medium">{user.name}</td>
                        <td className="text-muted small">{user.email}</td>
                        <td className="text-muted small">{user.phone || "—"}</td>
                        <td>
                          <Badge
                            bg={user.role === 1 ? "danger" : "success"}
                          >
                            {user.role === 1 ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="text-muted small">
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;