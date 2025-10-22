import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Register from "./Register";   

const BACKEND_URL = "http://localhost:8080";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/candidates`).then(res => setCandidates(res.data));
    axios.get(`${BACKEND_URL}/voters`).then(res => setVoters(res.data));
    axios.get(`${BACKEND_URL}/votes`).then(res => setVotes(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📌 Online Voting Dashboard</h2>

      {/* ✅ Registration Form */}
      <h3>Register Voter</h3>
      <Register />

      <h3>Candidates</h3>
      <ul>
        {candidates.map(c => (
          <li key={c._id}>{c.name} ({c.party})</li>
        ))}
      </ul>

      <h3>Voters</h3>
      <ul>
        {voters.map(v => (
          <li key={v._id}>{v.name} - {v.email}</li>
        ))}
      </ul>

      <h3>Votes</h3>
      <ul>
        {votes.map(v => (
          <li key={v._id}>Voter: {v.voterId} → Candidate: {v.candidateId}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
