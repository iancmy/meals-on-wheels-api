import express from "express";
import Member from "../model/Member.js";

import { auth } from "../service/auth.js";
import { encryptPassword } from "../service/passwordEncrypt.js";
import { checkUserExists } from "../service/user.js";

const router = express.Router();

router.post("/signup", [encryptPassword], async (req, res) => {
  const {
    firstName,
    lastName,
    birthdate,
    emailAddress,
    address,
    contactNumber,
    dietaryRestrictions,
    foodAllergies,
    password,
  } = req.body;

  // Check if user exists
  const userExists = await checkUserExists(emailAddress);
  if (userExists) {
    return res.status(400).json({ msg: "User already exists." });
  }

  try {
    await Member.create({
      firstName,
      lastName,
      birthdate,
      emailAddress,
      address: {
        fullAddress: address,
      },
      contactNumber,
      dietaryRestrictions,
      foodAllergies,
      password,
    });

    res.status(201).json({
      msg: "Member sign up successful!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.put("/update", [auth], async (req, res) => {
  const { userId } = req;

  try {
    const user = await Member.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    await Member.updateOne(
      { emailAddress: user.emailAddress },
      {
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
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

export default router;
