import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// --------------------
// Schema
// --------------------
const SignatureSchema = new mongoose.Schema({
  jobUUID: { type: String, required: true },
  clientName: { type: String, required: true },
  termsText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Signature = mongoose.model("Signature", SignatureSchema);

// --------------------
// API Endpoint
// --------------------
app.post("/api/create-signature", async (req, res) => {
  try {
    const { jobUUID, clientName, termsText } = req.body;

    if (!jobUUID || !termsText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const record = await Signature.create({
      jobUUID,
      clientName,
      termsText
    });

    return res.json({
      success: true,
      id: record._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
