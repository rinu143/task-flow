const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    console.log("[AUTH] POST /api/auth/signup", { ip: req.ip, body: req.body });
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash: hash });
    await user.save();
    console.log("[AUTH] Created user", {
      id: user._id.toString(),
      email: user.email,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("[AUTH] Signup error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("[AUTH] POST /api/auth/login", { ip: req.ip, body: req.body });
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("[AUTH] Login failed - user not found", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      console.log("[AUTH] Login failed - invalid password", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("[AUTH] Login success", {
      id: user._id.toString(),
      email: user.email,
    });

    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("[AUTH] Login error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
