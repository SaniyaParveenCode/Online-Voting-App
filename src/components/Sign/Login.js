import "./SignUtils/CSS/Sign.css";
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css";
import signinimage from "./SignUtils/images/signin-image.jpg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSuccess = () =>
    toast.success("Login Success", { className: "toast-message" });

  const loginFailed = () =>
    toast.error("Invalid Details or User Doesn't exist", { className: "toast-message" });

  const handleLogin = async () => {
    setLoading(true);
    try {

      const response = await axios.post("http://localhost:8080/api/voters/login", {
        email: email.trim(),
        password: pass.trim(),
      });

    
      const voterst = response.data.voter;

      if (response.data.success) {
   
        document.cookie = `myCookie=${voterst._id}; path=/; max-age=${24 * 60 * 60}`;

        loginSuccess();
        setTimeout(() => {
          navigate("/User", { state: { voterst } });
        }, 2000);
      } else {
        loginFailed();
      }
    } catch (error) {
      console.error("Login failed:", error);
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
          <div className="signin-content">
            <div className="signin-image">
              <figure>
                <img src={signinimage} alt="Sign in" />
              </figure>
              <Link to="/Signup" className="signup-image-link">
                Create an account
              </Link>
            </div>

            <div className="signin-form">
              <h2 className="form-title">Sign In</h2>
              <ToastContainer />
              <div className="form-group">
                <label htmlFor="email">
                  <i className="zmdi zmdi-account material-icons-name"></i>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  id="pass"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
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

export default Login;
