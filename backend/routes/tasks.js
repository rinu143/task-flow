const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.use(auth);

// GET /api/tasks - list user's tasks
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("[TASKS] GET /api/tasks", { userId, query: req.query });
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log("[TASKS] returning", { count: tasks.length });
    res.json({ tasks });
  } catch (err) {
    console.error("[TASKS] GET error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/tasks - create task
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      priority,
      scheduledTime,
      category,
      estimatedDuration,
    } = req.body;
    console.log("[TASKS] POST /api/tasks", { userId, body: req.body });
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = new Task({
      userId,
      title,
      description,
      priority: priority || "Medium",
      scheduledTime,
      category: category || "Inbox",
      estimatedDuration: estimatedDuration || 30,
    });

    await task.save();
    console.log("[TASKS] Created task", {
      id: task._id.toString(),
      title: task.title,
    });
    res.status(201).json({ task });
  } catch (err) {
    console.error("[TASKS] POST error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/tasks/:id - update task (partial)
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const update = req.body;
    console.log("[TASKS] PATCH /api/tasks/" + id, { userId, update });

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { ...update, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    console.log("[TASKS] Updated task", {
      id: task._id.toString(),
      changes: update,
    });
    res.json({ task });
  } catch (err) {
    console.error("[TASKS] PATCH error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    console.log("[TASKS] DELETE /api/tasks/" + id, { userId });

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    console.log("[TASKS] Deleted task", { id: id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("[TASKS] DELETE error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
