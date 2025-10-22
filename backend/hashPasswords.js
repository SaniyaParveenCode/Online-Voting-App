// hashPasswords.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Connect to your database
mongoose.connect("mongodb://127.0.0.1:27017/OnlineVoting", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define your Voter schema (should match your existing schema)
const VoterSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  state: String,
  city: String,
  dob: String,
  age: Number,
  voterId: { type: String, unique: true },
  phone: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  image: String
});

const Voter = mongoose.model("Voter", VoterSchema);

async function hashPasswords() {
  try {
    const voters = await Voter.find({}); // get all voters

    for (const voter of voters) {
      // Skip if already hashed (optional check)
      if (!voter.password.startsWith("$2a$")) {
        const hashed = await bcrypt.hash(voter.password, 10);
        voter.password = hashed;
        await voter.save();
        console.log(`✅ Password hashed for ${voter.email}`);
      }
    }

    console.log("All passwords hashed successfully!");
    process.exit(0); // exit script
  } catch (err) {
    console.error("❌ Error hashing passwords:", err);
    process.exit(1);
  }
}

hashPasswords();
