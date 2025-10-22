import React from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      e.target,
      "YOUR_PUBLIC_KEY"
    )
    .then((result) => {
      console.log(result.text);
      alert("Message sent successfully!");
      e.target.reset();
    }, (error) => {
      console.log(error.text);
      alert("Failed to send message.");
    });
  };

  return (
    <form onSubmit={sendEmail}>
      <input type="text" name="user_name" placeholder="Your Name" required />
      <input type="email" name="user_email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send</button>
    </form>
  );
};

export default Contact;
