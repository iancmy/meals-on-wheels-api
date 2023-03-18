import express from "express";
import Volunteer from "../model/Volunteer";

const router = express.Router();

// TODO: Add authentication middleware
// For admins only
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    await Volunteer.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      address: {
        fullAddress: req.body.address,
      },
      contactNumber: req.body.contactNumber,
      password: req.body.password,
      daysAvailable: req.body.daysAvailable,
      serviceProvided: req.body.serviceProvided,

});
} catch (err) {
  console.log(err);
}

res.status(201).json({
  message: "Volunteer created!",
});
});

// TODO: Login route

// TODO: Update profile route

export default router;
