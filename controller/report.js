import express from "express";
import { getPermissions } from "../service/admin.js";
import { auth } from "../service/auth.js";
import { getTotalDonations } from "../service/report.js";

const router = express.Router();

// Get donation reports
router.get("/donation", [auth, getPermissions], async (req, res) => {
  const { startDate, endDate } = req.query;
  const { permissions } = req;

  if (!permissions.includes("super") || !permissions.includes("admin")) {
    return res.status(401).json({ msg: "Unauthorized access!" });
  }

  try {
    const totalDonations = await getTotalDonations();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
