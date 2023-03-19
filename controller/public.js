import express from "express";
import Partner from "../model/Partner.js";

import Schedule from "../model/Schedule.js";
import { getDistance } from "../service/location.js";

const router = express.Router();

// Get all schedule
router.get("/schedule", async (req, res) => {
  try {
    const schedule = await Schedule.find().populate("partner", "-password");

    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get schedule by id
router.get("/schedule/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id).populate(
      "partner",
      "-password"
    );

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found!" });
    }

    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Nearby partners
router.get("/nearby", async (req, res) => {
  const { lat, long } = req.query;

  try {
    const nearbyPartners = await Partner.find().select(-"password");

    // Filter only partners within 10km
    const filteredPartners = nearbyPartners
      .filter((partner) => {
        const distance = getDistance(
          lat,
          long,
          partner.address.lat,
          partner.address.long
        );

        return distance <= 10;
      })
      .map((partner) => {
        const distance = getDistance(
          lat,
          long,
          partner.address.lat,
          partner.address.long
        ).toFixed(2);

        return {
          ...partner._doc,
          distanceInKilometer: distance,
        };
      });

    res.status(200).json(filteredPartners);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
