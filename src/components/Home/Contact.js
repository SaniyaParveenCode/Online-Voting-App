import React, { useState } from 'react';
import './CSS/contact.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendingFailed = (msg) => toast.error(msg, { className: 'toast-message' });
  const sendingSuccess = (msg) => toast.success(msg, { className: 'toast-message' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !message) {
      sendingFailed('Please fill all fields');
      setLoading(false);
      return;
    }

    // ✅ Matches your EmailJS template variables:
    const templateParams = {
      user_name: name,
      user_email: email,
      message: message
    };

    try {
      const response = await emailjs.send(
        'service_rs54t1c',        // ✅ your new Gmail service ID
        'template_yhjz63q',       // your existing template ID
        templateParams,
        'bkJ7k5VmhNoPw0eVb'       // your EmailJS public key
      );

      console.log('SUCCESS!', response.status, response.text);
      sendingSuccess('Your query has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('FAILED...', error);
      sendingFailed('Error sending your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Your Message"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
