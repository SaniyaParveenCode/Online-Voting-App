import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = "http://localhost:8080"; 

const AdminDashboard = () => {
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch voters
        const votersRes = await axios.get(`${BASE_URL}/voters`);
        const voterData = votersRes.data || [];
        setVoters(voterData);

        // Fetch candidates
        const candidatesRes = await axios.get(`${BASE_URL}/candidates`);
        const candidateData = candidatesRes.data || [];
        setCandidates(candidateData);

        // Fetch votes
        const votesRes = await axios.get(`${BASE_URL}/vote`);
        const votesData = votesRes.data || [];
        setVotes(votesData);

        // Compute dashboard stats
        const voterCount = voterData.length;
        const candidateCount = candidateData.length;
        const votesCast = votesData.length;
        const votersVoted = voterData.filter(v => v.voterStatus === "Voted").length;

        // Compute votes per candidate
        const votesPerCandidate = candidateData.map(c => ({
          ...c,
          votes: votesData.filter(v => v.candidateId === c._id).length,
        }));

        setCandidates(votesPerCandidate);

        setDashboard({ voterCount, candidateCount, votersVoted, votesCast });
      } catch (err) {
        console.error(" Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <AdminSidebar />
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              background: "#111",
            }}
          >
            Loading dashboard...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div
          style={{
            flex: 1,
            padding: "2rem",
            color: "#fff",
            background: "#111",
            minHeight: "100vh",
          }}
        >
          <h1>Welcome Administrator</h1>

          {/* Dashboard Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
            <div style={{ padding: "1rem", background: "#222", borderRadius: "8px", flex: 1 }}>
              <h3>Total Voters</h3>
              <p>{dashboard.voterCount}</p>
            </div>
            <div style={{ padding: "1rem", background: "#222", borderRadius: "8px", flex: 1 }}>
              <h3>Total Candidates</h3>
              <p>{dashboard.candidateCount}</p>
            </div>
            <div style={{ padding: "1rem", background: "#222", borderRadius: "8px", flex: 1 }}>
              <h3>Voters Who Have Voted</h3>
              <p>{dashboard.votersVoted}</p>
            </div>
            <div style={{ padding: "1rem", background: "#222", borderRadius: "8px", flex: 1 }}>
              <h3>Total Votes Cast</h3>
              <p>{dashboard.votesCast}</p>
            </div>
          </div>

          {/* Candidates Table */}
          <h2 style={{ marginTop: "2rem" }}>Candidates</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={{ padding: "0.5rem" }}>Name</th>
                <th style={{ padding: "0.5rem" }}>Party</th>
                <th style={{ padding: "0.5rem" }}>Age</th>
                <th style={{ padding: "0.5rem" }}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c._id} style={{ borderBottom: "1px solid #444" }}>
                  <td style={{ padding: "0.5rem" }}>{c.name}</td>
                  <td style={{ padding: "0.5rem" }}>{c.party}</td>
                  <td style={{ padding: "0.5rem" }}>{c.age}</td>
                  <td style={{ padding: "0.5rem" }}>{c.votes || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Voters Table */}
          <h2 style={{ marginTop: "2rem" }}>Voters</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={{ padding: "0.5rem" }}>Name</th>
                <th style={{ padding: "0.5rem" }}>Email</th>
                <th style={{ padding: "0.5rem" }}>Phone</th>
                <th style={{ padding: "0.5rem" }}>Voter Status</th>
              </tr>
            </thead>
            <tbody>
              {voters.map(v => (
                <tr key={v._id} style={{ borderBottom: "1px solid #444" }}>
                  <td style={{ padding: "0.5rem" }}>
                    {v.firstName} {v.lastName}
                  </td>
                  <td style={{ padding: "0.5rem" }}>{v.email}</td>
                  <td style={{ padding: "0.5rem" }}>{v.phone}</td>
                  <td style={{ padding: "0.5rem" }}>{v.voterStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
