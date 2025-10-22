import "./SignUtils/CSS/Sign.css";
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css";
import signinimage from "./SignUtils/images/adminbanner.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import NavBar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8080";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSuccess = () =>
    toast.success("Login Success", { className: "toast-message" });
  const loginFailed = () =>
    toast.error("Invalid Details\nPlease Try Again!", { className: "toast-message" });

  // -------- TEMPORARY ADMIN CREATION --------
  useEffect(() => {
    const createTempAdmin = async () => {
      try {
        await axios.get(`${BASE_URL}/api/admin/create`);
      } catch (err) {
        console.warn(
          "⚠️ Admin creation skipped or already exists:",
          err.response?.data || err.message
        );
      }
    };

    createTempAdmin();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      loginFailed();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data.success) {
        loginSuccess();
        setTimeout(() => navigate("/Admin"), 2000);
      } else {
        loginFailed();
      }
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error);
      loginFailed();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <section className="sign-in">
        <div className="container">
          <p>Use your admin email and password to login</p>
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={signinimage} alt="Admin Banner" />
              </figure>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Admin Login</h2>
              <ToastContainer />
              <div className="form-group">
                <label htmlFor="email">
                  <i className="zmdi zmdi-account material-icons-name"></i>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  name="pass"
                  id="pass"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group form-button">
                <button onClick={handleLogin} disabled={loading}>
                  {loading ? <div className="spinner"></div> : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
