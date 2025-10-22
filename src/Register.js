import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    dob: "",
    voterId: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFormData({
          firstName: "",
          lastName: "",
          state: "",
          city: "",
          dob: "",
          voterId: "",
          phone: "",
          email: "",
          password: ""
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          type={key === "dob" ? "date" : key === "password" ? "password" : "text"}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          required
        />
      ))}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

