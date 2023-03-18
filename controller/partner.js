import express from "express";
import Partner from "../model/Partner";

const router = express.Router();

// TODO: Add authentication middleware
// For admins only
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json(partners);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    await Partner.create({
      businessName: req.body.businessName,
      emailAddress: req.body.emailAddress,
      address: {
        fullAddress: req.body.address,
      },
      contactNumber: req.body.contactNumber,
      password: req.body.password,
      daysAvailable: req.body.daysAvailable,
      serviceType: req.body.serviceType,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    message: "Partner created!",
  });
});

// TODO: Login route

// TODO: Update profile route

export default router;
