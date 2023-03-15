// Using positionstack.com API
// https://positionstack.com/documentation
import express from "express";
import dotenv from "dotenv";
import opencage from "opencage-api-client";

dotenv.config();

const { LOCATION_API_KEY } = process.env;

const router = express.Router();

router.get("/address", async (req, res) => {
  const { lat, long } = req.query;

  try {
    const data = await opencage.geocode({
      q: `${lat},${long}`,
      key: LOCATION_API_KEY,
      limit: 1,
    });

    res.status(200).json(data.results);
  } catch (err) {
    console.log(err);
  }
});

router.get("/coordinates", async (req, res) => {
  const { address } = req.query;

  try {
    const data = await opencage.geocode({
      q: address,
      key: LOCATION_API_KEY,
      limit: 1,
    });

    res.status(200).json(data.results);
  } catch (err) {
    console.log(err);
  }
});

export default router;
