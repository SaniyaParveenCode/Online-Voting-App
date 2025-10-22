import "./SignUtils/CSS/Sign.css";
import "./SignUtils/CSS/CandidateRegister.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../helper";

const CandidateRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const CreationSuccess = () =>
    toast.success(
      "Candidate Created Successfully \n Click Anywhere to exit this screen",
      { className: "toast-message" }
    );

  const CreationFailed = () =>
    toast.error("Invalid Details \n Please Try Again!", {
      className: "toast-message",
    });

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    party: "",
    bio: "",
    image: null,
    symbol: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("party", formData.party);
    formDataToSend.append("bio", formData.bio || "");
    if (formData.image) formDataToSend.append("image", formData.image); // consistent naming
    if (formData.symbol) formDataToSend.append("symbol", formData.symbol);

    try {
      const response = await axios.post(`${BASE_URL}/api/candidates`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        CreationSuccess();
        setTimeout(() => navigate("/Candidate"), 200);
      } else {
        CreationFailed();
      }
    } catch (error) {
      console.error(error);
      CreationFailed();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="Candidatesignup">
      <div className="FormTitle">
        <h2>New Candidate</h2>
      </div>
      <div className="container">
        <div className="signup-content">
          <div className="signup-form">
            <ToastContainer />
            <form className="register-form" encType="multipart/form-data">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Candidate Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Candidate Age"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  placeholder="Party Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Candidate Bio"
                />
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  placeholder="Candidate Photo"
                />
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="symbol"
                  onChange={handleFileChange}
                  placeholder="Party Symbol"
                />
              </div>
              <div className="form-group form-button">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="form-submit"
                >
                  {loading ? <div className="spinner"></div> : "Create Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandidateRegister;
