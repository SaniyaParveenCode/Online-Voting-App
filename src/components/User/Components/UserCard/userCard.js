import React from "react";
import "./userCard.css";

export default function UserCard({ voter }) {
  if (!voter) {
    return (
      <div className="User-Card">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="User-Card">
      {/* Profile Image */}
      <div className="userImage">
        {voter.image ? (
          <img
            src={voter.image}
            alt={`${voter.firstName} ${voter.lastName}`}
            className="profile-img"
          />
        ) : (
          <div className="noImage">No Image</div>
        )}
      </div>

      {/* User Details */}
      <div className="userDetails1">
        <h6>
          <strong>Name:</strong> {voter.firstName} {voter.lastName}
        </h6>
        <h6>
          <strong>Age:</strong> {voter.age}
        </h6>
        <h6>
          <strong>Phone:</strong> {voter.phone}
        </h6>
        <h6>
          <strong>Voter ID:</strong> {voter.voterId}
        </h6>
        <h6>
          <strong>Voter Status:</strong>{" "}
          <span
            className={
              voter.voterStatus === "Voted" ? "status-voted" : "status-notvoted"
            }
          >
            {voter.voterStatus}
          </span>
        </h6>
      </div>
    </div>
  );
}