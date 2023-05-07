import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Url from "./models/Url.js";
import { isValidUrl, generateShortCode } from "./utils/urlValidator.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173","https://url-shortener-steel-chi.vercel.app/"],
  }),
);
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB Error:", err));

// Shorten URL
app.post("/api/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Check if already exists
    let existingUrl = await Url.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({ shortCode: existingUrl.shortCode });
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    while (!isUnique) {
      shortCode = generateShortCode();
      const existing = await Url.findOne({ shortCode });
      if (!existing) isUnique = true;
    }

    const newUrl = new Url({ originalUrl: url, shortCode });
    await newUrl.save();

    res.json({ shortCode });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get original URL
app.get("/api/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ originalUrl: url.originalUrl });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect when visiting short URL
app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).send("URL not found");
    }
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  try {
    console.log(`Server running on port ${PORT}...`);
  } catch (error) {
    console.log("Something went wrong...");
  }
});
