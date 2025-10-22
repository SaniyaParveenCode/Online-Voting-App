import { useEffect, React, useRef } from "react";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router-dom";

import "../CSS/upcomingElections.css";

const UpcomingElections = ({ voteStatus }) => {
  const navigate = useNavigate();

  const revealRefBottom = useRef(null);
  const revealRefLeft = useRef(null);
  const revealRefTop = useRef(null);
  const revealRefRight = useRef(null);

  // ScrollReveal Effects
  useEffect(() => {
    const sr = ScrollReveal({ duration: 1000, delay: 200, distance: "50px", easing: "ease", reset: true });
    sr.reveal(revealRefBottom.current, { origin: "bottom" });
    sr.reveal(revealRefRight.current, { origin: "right" });
    sr.reveal(revealRefLeft.current, { origin: "left" });
    sr.reveal(revealRefTop.current, { origin: "top" });
  }, []);

  //  Reusable Election Card
  const ElectionCard = ({ innerRef, title, description }) => (
    <div className="upcomingElectionCard" ref={innerRef}>
      <h3>{title}</h3>
      <br />
      <p>{description}</p>
      <br />
      {voteStatus === "Not Voted" ? (
        <button onClick={() => navigate("/Vote")}>Participate / Vote</button>
      ) : (
        <button disabled className="votedBtn">
          Already Voted
        </button>
      )}
    </div>
  );

  return (
    <div className="upcomingElections">
      <h2 ref={revealRefTop}>Upcoming Elections</h2>

      <div className="upcomingElectionsCardContainer">
        <ElectionCard
          innerRef={revealRefLeft}
          title="2025 India General Election"
          description={
            <>
              General elections will be held in India from <strong>April to June 2025</strong> 
              to elect the <strong>543 members</strong> of the 18th Lok Sabha. The elections 
              will be held in multiple phases and the results are expected in <strong>June 2025</strong>.
            </>
          }
        />

        <ElectionCard
          innerRef={revealRefBottom}
          title="2025 India General Election"
          description={
            <>
              General elections will be held in India from <strong>April to June 2025</strong> 
              to elect the <strong>543 members</strong> of the 18th Lok Sabha. The elections 
              will be held in multiple phases and the results are expected in <strong>June 2025</strong>.
            </>
          }
        />

        <ElectionCard
          innerRef={revealRefRight}
          title="2025 India General Election"
          description={
            <>
              General elections will be held in India from <strong>April to June 2025</strong> 
              to elect the <strong>543 members</strong> of the 18th Lok Sabha. The elections 
              will be held in multiple phases and the results are expected in <strong>June 2025</strong>.
            </>
          }
        />
      </div>
    </div>
  );
};

export default UpcomingElections;


