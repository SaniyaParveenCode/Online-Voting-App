import mongoose from "mongoose";

const VoterSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  state: String,
  city: String,
  dob: { type: String, required: true },
  age: Number,
  voterId: { type: String, unique: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  image: String, 
  voterStatus: { type: String, default: "Not Voted" },
});

const Voter = mongoose.models.Voter || mongoose.model("Voter", VoterSchema);

export default Voter;
