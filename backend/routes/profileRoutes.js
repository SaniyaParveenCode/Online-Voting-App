import express from "express";
import Voter from "../models/VoterModel.js"; 

const router = express.Router();

// ✅ Get profile by MongoDB _id or custom voterId
router.get("/:id", async (req, res) => {
  try {
    let voter = await Voter.findById(req.params.id).select("-password");
    if (!voter) {
      voter = await Voter.findOne({ voterId: req.params.id }).select("-password");
    }

    if (!voter) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(voter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
