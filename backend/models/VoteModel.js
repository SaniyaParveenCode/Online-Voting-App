import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: "Voter" },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
});

const Vote = mongoose.models.Vote || mongoose.model("Vote", VoteSchema);

export default Vote;
