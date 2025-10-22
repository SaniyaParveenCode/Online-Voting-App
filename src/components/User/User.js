import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ScrollReveal from "scrollreveal";

import UserNavbar from "../Navbar/UserNavbar";
import UserCard from "./Components/UserCard/userCard";
import UpcomingElections from "./Components/UpcomingElections";

import "./CSS/user.css";

const User = () => {
  const location = useLocation();
  const { voterst } = location.state || {};

  const [singleVoter, setSingleVoter] = useState(null);

  const fetchVoter = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/voters/${id}`);
      if (res.data.success) {
        setSingleVoter(res.data.voter);
      }
    } catch (err) {
      console.error("❌ Error fetching voter:", err);
    }
  };

  useEffect(() => {
    let voterId = Cookies.get("myCookie");

    if (voterId) {
      fetchVoter(voterId);
    } else {
      axios
        .get("http://localhost:8080/api/voters")
        .then((res) => {
          if (res.data && res.data.voters && res.data.voters.length > 0) {
            voterId = res.data.voters[0]._id;
            Cookies.set("myCookie", voterId, { path: "/", expires: 7 });
            console.log("✅ Auto-set myCookie:", voterId);
            fetchVoter(voterId);
          }
        })
        .catch((err) => console.error("❌ Error fetching voters list:", err));
    }
  }, []);

  const revealRefBottom = useRef(null);
  const revealRefLeft = useRef(null);
  const revealRefTop = useRef(null);
  const revealRefRight = useRef(null);

  useEffect(() => {
    const sr = ScrollReveal();

    if (revealRefBottom.current)
      sr.reveal(revealRefBottom.current, {
        duration: 1000,
        delay: 200,
        distance: "50px",
        origin: "bottom",
        easing: "ease",
        reset: true,
      });

    if (revealRefRight.current)
      sr.reveal(revealRefRight.current, {
        duration: 1000,
        delay: 200,
        distance: "50px",
        origin: "right",
        easing: "ease",
        reset: true,
      });

    if (revealRefLeft.current)
      sr.reveal(revealRefLeft.current, {
        duration: 1000,
        delay: 200,
        distance: "50px",
        origin: "left",
        easing: "ease",
        reset: true,
      });

    if (revealRefTop.current)
      sr.reveal(revealRefTop.current, {
        duration: 1000,
        delay: 200,
        distance: "50px",
        origin: "top",
        easing: "ease",
        reset: true,
      });
  }, []);

  return (
    <div className="User">
      <UserNavbar />

      {/* Greeting */}
      <div className="Heading2" ref={revealRefTop}>
        <h3>
          Welcome <span>{singleVoter?.firstName || "User"}</span>
        </h3>
      </div>

      <div className="userPage">
        {/* Left: voter card */}
        <div className="userDetails" ref={revealRefLeft}>
          <UserCard voter={singleVoter} />
        </div>

        {/* Right: intro */}
        <div className="details" ref={revealRefRight}>
          <h2>
            Welcome to <span>Online Voting Platform</span>
          </h2>
          <h6>Exercise Your Right to Vote Anytime, Anywhere</h6>
          <p>
            Welcome to our online voting platform, where your voice matters.
            With the convenience of modern technology, we bring democracy to
            your fingertips, enabling you to participate in important decisions
            and elections from the comfort of your own home. Our secure and
            user-friendly platform ensures that your vote is counted accurately
            and confidentially. Whether it's electing your local representatives,
            deciding on community initiatives, or participating in
            organizational polls, our platform empowers you to make a difference.
          </p>
        </div>
      </div>

      {/* Upcoming elections */}
      <UpcomingElections voteStatus={singleVoter?.voterStatus} />
    </div>
  );
};

export default User;


