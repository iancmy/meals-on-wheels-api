import express from "express";
import Donation from "../model/Donation";

const router = express.Router();

// TODO: Add authentication middleware
// For admins only
router.get("/", async (req, res) => {
  try {
    const donors = await Donation.find();
    res.status(200).json(donors);
  } catch (err) {
    console.log(err);
  }
});

router.post("/donate", async (req, res) => {
  try {
    await Donation.create({
      donorName: req.body.donorName,
      donationType: req.body.donationType,
      emailAddress: req.body.emailAddress,
      Amount: req.body.Amount,
      paymentMethod : req.body.paymentMethod,
      comment: req.body.comment,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    message: "Donation Successful!",
  });
});

// TODO: Login route

// TODO: Update profile route

export default router;
