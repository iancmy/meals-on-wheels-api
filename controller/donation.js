import express from "express";
import Donation from "../model/Donation.js";

const router = express.Router();

router.post("/donate", async (req, res) => {
  const {
    donorName,
    donationType,
    emailAddress,
    amount,
    paymentMethod,
    comment,
  } = req.body;

  try {
    const donation = await Donation.create({
      donorName,
      donationType,
      emailAddress,
      amount,
      paymentMethod,
      comment,
    });

    res.status(201).json({
      status: "success",
      msg: "Donation created successfully",
      receipt: donation,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
