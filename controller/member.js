import express from "express";
import Member from "../model/Member.js";

const router = express.Router();

// TODO: Add authentication middleware
// For admins only
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    await Member.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthdate: req.body.birthdate,
      emailAddress: req.body.emailAddress,
      address: {
        fullAddress: req.body.address,
      },
      contactNumber: req.body.contactNumber,
      dietaryRestrictions: req.body.dietaryRestrictions,
      foodAllergies: req.body.foodAllergies,
      password: req.body.password,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    message: "Member created!",
  });
});

// TODO: Login route

// TODO: Update profile route

export default router;
