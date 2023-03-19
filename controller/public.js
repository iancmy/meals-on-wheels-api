import express from "express";

import Schedule from "../model/Schedule.js";

const router = express.Router();

// Get all schedule
router.get("/schedule", async (req, res) => {
  try {
    const schedule = await Schedule.find();

    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get schedule by id
router.get("/schedule/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found!" });
    }

    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
