import express from "express";
import Member from "../model/Member.js";

import { auth } from "../service/auth.js";
import { encryptPassword } from "../service/passwordEncrypt.js";
import { checkUserExists } from "../service/user.js";
import { getCoordinates } from "../service/location.js";

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
    // Get the coordinates of the address
    const results = await getCoordinates(address);
    const { lat, lng } = results[0].geometry;

    await Member.create({
      firstName,
      lastName,
      birthdate,
      emailAddress,
      address: {
        fullAddress: address,
        lat,
        long: lng,
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

    const {
      firstName,
      lastName,
      birthdate,
      emailAddress,
      address,
      contactNumber,
      dietaryRestrictions,
      foodAllergies,
    } = req.body;

    // Check for changes
    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
    }

    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
    }

    if (birthdate && birthdate !== user.birthdate) {
      user.birthdate = birthdate;
    }

    if (emailAddress && emailAddress !== user.emailAddress) {
      user.emailAddress = emailAddress;
    }

    if (address && address !== user.address.fullAddress) {
      const results = await getCoordinates(address);
      const { lat, lng } = results[0].geometry;

      user.address = {
        fullAddress: address,
        lat,
        long: lng,
      };
    }

    if (contactNumber && contactNumber !== user.contactNumber) {
      user.contactNumber = contactNumber;
    }

    if (
      !user.dietaryRestrictions.every((restriction) =>
        dietaryRestrictions.includes(restriction)
      ) ||
      !dietaryRestrictions.every((restriction) =>
        user.dietaryRestrictions.includes(restriction)
      )
    ) {
      user.dietaryRestrictions = dietaryRestrictions;
    }

    if (
      !user.foodAllergies.every((allergy) => foodAllergies.includes(allergy)) ||
      !foodAllergies.every((allergy) => user.foodAllergies.includes(allergy))
    ) {
      user.foodAllergies = foodAllergies;
    }

    await user.save();

    res.status(200).json({
      msg: "Member profile updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

export default router;
