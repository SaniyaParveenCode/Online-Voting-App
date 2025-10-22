import "./SignUtils/CSS/Sign.css";
import signupimage from "./SignUtils/images/signup-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../helper";  // ✅ import helper.js

// Mapping of states to cities
const stateCityMapping = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Arunachal Pradesh": ["Itanagar", "Tawang"],
  "Assam": ["Guwahati", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya"],
  "Chhattisgarh": ["Raipur", "Bhilai"],
  "Goa": ["Panaji", "Margao"],
  "Gujarat": ["Ahmedabad", "Surat"],
  "Haryana": ["Chandigarh", "Gurugram"],
  "Himachal Pradesh": ["Shimla", "Manali"],
  "Jharkhand": ["Ranchi", "Jamshedpur"],
  "Karnataka": ["Bengaluru", "Mysore"],
  "Kerala": ["Thiruvananthapuram", "Kochi"],
  "Madhya Pradesh": ["Bhopal", "Indore"],
  "Maharashtra": ["Mumbai", "Pune"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima"],
  "Odisha": ["Bhubaneswar", "Cuttack"],
  "Punjab": ["Amritsar", "Ludhiana"],
  "Rajasthan": ["Jaipur", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Greater Noida",
    "Noida",
    "Bijnor",
    "Najibabad",
    "Meerut",
  ],
  "Uttarakhand": ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Darjeeling"],
};

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    state: "",
    dob: "",
    phone: "",
    image: null,
    email: "",
    password: "",
    re_pass: "",
  });

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const age = calculateAge(value);
      setFormData({ ...formData, [name]: value, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.re_pass) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.age < 18) {
      alert("You must be at least 18 years old");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("re_pass", formData.re_pass);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      // ✅ corrected URL
      const response = await axios.post(
        `${BASE_URL}/api/voters/register`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, { className: "toast-message" });
        setTimeout(() => navigate("/Login"), 2000);
      } else {
        toast.error(response.data.message || "Registration failed", {
          className: "toast-message",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Network Error", {
        className: "toast-message",
      });
    } finally {
      setLoading(false);
    }
  };

  const cities = stateCityMapping[formData.state] || [];

  return (
    <div className="Sign-Container">
      <NavBar />
      <section className="signup">
        <div className="container">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Registration</h2>
              <form className="register-form" onSubmit={handleSubmit}>
                <ToastContainer />
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your First Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your Last Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Your State</option>
                    {Object.keys(stateCityMapping).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Your City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="re_pass"
                    value={formData.re_pass}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                  />
                </div>
                <div className="form-group form-button">
                  <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : "Register"}
                  </button>
                </div>
              </form>
            </div>
            <div className="signup-image">
              <figure>
                <img src={signupimage} alt="Sign up" />
              </figure>
              <Link to="/Login" className="signup-image-link">
                I am already a member
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


