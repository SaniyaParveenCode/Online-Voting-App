import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String },   
  symbol: { type: String },  
  status: { type: String, default: "upcoming" }
});

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
