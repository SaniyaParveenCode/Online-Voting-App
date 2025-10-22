// ---------------- IMPORTS ----------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";

import profileRoutes from "./routes/profileRoutes.js";
import Voter from "./models/VoterModel.js";
import Candidate from "./models/CandidateModel.js";
import Vote from "./models/VoteModel.js";
import Admin from "./models/AdminModel.js";

// ---------------- SETUP ----------------
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = "mongodb://127.0.0.1:27017/votingApp";
const API_ROOT = "/api";

// ---------------- MIDDLEWARE ----------------
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- HELPERS ----------------
const generateVoterID = () =>
  Date.now().toString() + Math.floor(Math.random() * 1000);

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  )
    age--;
  return age;
};

const normalizeImageUrl = (req, url) =>
  url?.startsWith("http")
    ? url
    : `${req.protocol}://${req.get("host")}/${url?.replace(/^\/+/, "")}`;

// ---------------- ROUTES ----------------

// Health check
app.get("/", (req, res) =>
  res.json({ success: true, message: "✅ Online Voting Backend Running..." })
);

// Profile routes
app.use(`${API_ROOT}/profile`, profileRoutes);

// -------- CREATE VOTER --------
const createVoterHandler = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      state,
      city,
      dob,
      phone,
      email,
      password,
      re_pass,
    } = req.body;

    if (!firstName || !lastName || !dob || !phone || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    if (password !== re_pass) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    if (await Voter.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    if (await Voter.findOne({ phone })) {
      return res
        .status(400)
        .json({ success: false, message: "Phone already registered" });
    }

    const age = calculateAge(dob);
    if (age < 18) {
      return res
        .status(400)
        .json({ success: false, message: "Must be at least 18 years old" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

    const voter = new Voter({
      firstName,
      lastName,
      state,
      city,
      dob,
      age,
      voterId: generateVoterID(),
      phone,
      email,
      password: hashedPassword,
      image: imageUrl,
      voterStatus: "Not Voted",
    });

    await voter.save();
    res.json({ success: true, message: "Registration successful", voter });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

app.post(`${API_ROOT}/voters/register`, upload.single("image"), createVoterHandler);
app.post("/createVoter", upload.single("image"), createVoterHandler);

// -------- VOTER LOGIN --------
app.post(`${API_ROOT}/voters/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email & password required" });

    const voter = await Voter.findOne({ email });
    if (!voter)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful", voter });
  } catch (err) {
    console.error("❌ Voter login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- ADMIN LOGIN --------
app.post(`${API_ROOT}/admin/login`, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email & password required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful", admin });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- CREATE ADMIN (TEMP) --------
app.get(`${API_ROOT}/admin/create`, async (req, res) => {
  try {
    const email = "saniyayusuf433@gmail.com";
    if (await Admin.findOne({ email }))
      return res.send({ success: false, message: "Admin already exists!" });

    const hashedPassword = await bcrypt.hash("12345", 10);
    const newAdmin = new Admin({
      username: "Saniya",
      email,
      password: hashedPassword,
    });
    await newAdmin.save();

    res.send({ success: true, message: "Admin created successfully!" });
  } catch (err) {
    console.error("❌ Create admin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- GET ALL VOTERS --------
app.get(`${API_ROOT}/voters`, async (req, res) => {
  try {
    const voters = await Voter.find().select("-password");
    const normalized = voters.map((v) => ({
      ...v.toObject(),
      image: normalizeImageUrl(req, v.image),
    }));
    res.json({ success: true, voters: normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------- GET SINGLE VOTER --------
app.get(`${API_ROOT}/voters/:id`, async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id).select("-password");
    if (!voter)
      return res
        .status(404)
        .json({ success: false, message: "Voter not found" });

    res.json({
      success: true,
      voter: { ...voter.toObject(), image: normalizeImageUrl(req, voter.image) },
    });
  } catch (err) {
    console.error("❌ Error fetching voter:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ -------- UPDATE VOTER --------
app.put(`${API_ROOT}/voters/:id`, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) updates.image = `uploads/${req.file.filename}`;

    const updatedVoter = await Voter.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!updatedVoter)
      return res
        .status(404)
        .json({ success: false, message: "Voter not found" });

    res.json({
      success: true,
      message: "Voter updated successfully",
      voter: {
        ...updatedVoter.toObject(),
        image: normalizeImageUrl(req, updatedVoter.image),
      },
    });
  } catch (err) {
    console.error("❌ Error updating voter:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ -------- DELETE VOTER --------
app.delete(`${API_ROOT}/voters/:id`, async (req, res) => {
  try {
    const deletedVoter = await Voter.findByIdAndDelete(req.params.id);
    if (!deletedVoter)
      return res
        .status(404)
        .json({ success: false, message: "Voter not found" });

    res.json({ success: true, message: "Voter deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting voter:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- GET ALL CANDIDATES --------
app.get(`${API_ROOT}/candidates`, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const candidatesWithVotes = await Promise.all(
      candidates.map(async (c) => {
        const votes = await Vote.countDocuments({ candidateId: c._id });
        return {
          ...c.toObject(),
          votes,
          image: normalizeImageUrl(req, c.image),
          symbol: normalizeImageUrl(req, c.symbol),
        };
      })
    );
    res.json({ success: true, candidates: candidatesWithVotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------- CREATE CANDIDATE --------
app.post(
  `${API_ROOT}/candidates`,
  upload.fields([{ name: "image" }, { name: "symbol" }]),
  async (req, res) => {
    try {
      const { name, party, age, status } = req.body;
      if (!name || !party || !age)
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });

      const candidate = new Candidate({
        name,
        party,
        age,
        image: req.files?.image ? `uploads/${req.files.image[0].filename}` : null,
        symbol: req.files?.symbol
          ? `uploads/${req.files.symbol[0].filename}`
          : null,
        status: status || "Pending",
      });

      await candidate.save();
      res.json({
        success: true,
        message: "Candidate added",
        candidate: {
          ...candidate.toObject(),
          image: normalizeImageUrl(req, candidate.image),
          symbol: normalizeImageUrl(req, candidate.symbol),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// -------- UPDATE CANDIDATE --------
app.put(
  `${API_ROOT}/candidates/:id`,
  upload.fields([{ name: "image" }, { name: "symbol" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.files?.image)
        updates.image = `uploads/${req.files.image[0].filename}`;
      if (req.files?.symbol)
        updates.symbol = `uploads/${req.files.symbol[0].filename}`;

      const updatedCandidate = await Candidate.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!updatedCandidate)
        return res
          .status(404)
          .json({ success: false, message: "Candidate not found" });

      res.json({
        success: true,
        message: "Candidate updated successfully",
        candidate: {
          ...updatedCandidate.toObject(),
          image: normalizeImageUrl(req, updatedCandidate.image),
          symbol: normalizeImageUrl(req, updatedCandidate.symbol),
        },
      });
    } catch (err) {
      console.error("❌ Error updating candidate:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// -------- DELETE CANDIDATE --------
app.delete(`${API_ROOT}/candidates/:id`, async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!deletedCandidate)
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });

    res.json({ success: true, message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting candidate:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- CAST VOTE --------
app.post(`${API_ROOT}/votes`, async (req, res) => {
  try {
    const { voterId, candidateId } = req.body;
    if (!voterId || !candidateId)
      return res
        .status(400)
        .json({ success: false, message: "voterId and candidateId required" });

    const voter = await Voter.findById(voterId);
    if (!voter)
      return res.status(404).json({ success: false, message: "Voter not found" });
    if (voter.voterStatus === "Voted")
      return res
        .status(400)
        .json({ success: false, message: "Voter already voted" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });

    const vote = new Vote({ voterId, candidateId });
    await vote.save();

    voter.voterStatus = "Voted";
    await voter.save();

    res.json({ success: true, message: "Vote cast successfully", vote });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// -------- DASHBOARD DATA --------
app.get(`${API_ROOT}/dashboard`, async (req, res) => {
  try {
    const voterCount = await Voter.countDocuments();
    const candidateCount = await Candidate.countDocuments();
    const votersVoted = await Voter.countDocuments({ voterStatus: "Voted" });
    const votesCast = await Vote.countDocuments();

    res.json({
      success: true,
      dashboard: { voterCount, candidateCount, votersVoted, votesCast },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- DB CONNECTION ----------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Database connection error:", err));
