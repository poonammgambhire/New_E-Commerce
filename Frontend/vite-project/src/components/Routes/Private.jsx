import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Private = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (loading) return;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/auth/user-auth`,
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );
        if (data.ok) {
          setOk(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    };

    if (auth?.token) {
      checkAuth();
    } else {
      navigate("/login");
    }
  }, [auth, loading, navigate]);

  if (loading || !ok) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default Private;