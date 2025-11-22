const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
  try {
    const time = new Date().toISOString();
    console.log(
      `[${time}] ${req.method} ${req.originalUrl} - ip=${
        req.ip
      } - query=${JSON.stringify(req.query)} - body=${JSON.stringify(req.body)}`
    );
  } catch (err) {
    console.log("Failed to log request", err);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

app.get("/", (req, res) =>
  res.json({ message: "TaskFlow backend is running" })
);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
