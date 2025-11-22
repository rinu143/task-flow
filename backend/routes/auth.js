const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET;

// Password strength helpers
function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(password);
  score += hasLower + hasUpper + hasDigit + hasSpecial; // 0..4
  if (password.length >= 10) score = Math.min(4, score + 1);
  return Math.min(4, score);
}

function isStrongEnough(password) {
  if (!password) return false;
  if (password.length < 6) return false;
  return getPasswordStrength(password) >= 3; // require at least 3 categories
}

router.post("/signup", async (req, res) => {
  try {
    const safeBodySignup = { ...req.body };
    if (safeBodySignup.password) safeBodySignup.password = "***";
    console.log("[AUTH] POST /api/auth/signup", {
      ip: req.ip,
      body: safeBodySignup,
    });
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    // validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          message: "Password must be at least 6 characters long",
          strength: getPasswordStrength(password),
        });
    }
    if (!isStrongEnough(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password is too weak. Use a mix of uppercase, lowercase, digits and special characters.",
          strength: getPasswordStrength(password),
        });
    }

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
    const safeBodyLogin = { ...req.body };
    if (safeBodyLogin.password) safeBodyLogin.password = "***";
    console.log("[AUTH] POST /api/auth/login", {
      ip: req.ip,
      body: safeBodyLogin,
    });
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

// GET /api/auth/me - return current user (requires Authorization header)
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("[AUTH] /me error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
