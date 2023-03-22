import express from "express";
import Volunteer from "../model/Volunteer.js";
import { auth } from "../service/auth.js";
import { getCoordinates } from "../service/location.js";
import { encryptPassword } from "../service/passwordEncrypt.js";
import { checkUserExists } from "../service/user.js";

const router = express.Router();

router.post("/signup", [encryptPassword], async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    address,
    contactNumber,
    password,
    daysAvailable,
    serviceProvided,
  } = req.body;

  // Check if user exists
  const userExists = await checkUserExists(emailAddress);
  if (userExists) {
    return res.status(400).json({ msg: "User already exists." });
  }

  try {
    const results = await getCoordinates(address);
    const lat = results[0].geometry.lat;
    const long = results[0].geometry.lng;

    await Volunteer.create({
      firstName,
      lastName,
      emailAddress,
      address: {
        fullAddress: address,
        lat,
        long,
      },
      contactNumber,
      password,
      daysAvailable,
      serviceProvided,
    });

    res.status(201).json({
      msg: "Volunteer sign up successful!",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating volunteer: " + err,
    });
  }
});

router.put("/update", [auth], async (req, res) => {
  const { userId } = req;

  const {
    firstName,
    lastName,
    emailAddress,
    address,
    contactNumber,
    daysAvailable,
    serviceProvided,
  } = req.body;

  try {
    const volunteer = await Volunteer.findById(userId);

    if (!volunteer) {
      res.status(404).json({
        msg: "Volunteer not found!",
      });
    }

    if (firstName && firstName !== volunteer.firstName) {
      volunteer.firstName = firstName;
    }

    if (lastName && lastName !== volunteer.lastName) {
      volunteer.lastName = lastName;
    }

    if (emailAddress && emailAddress !== volunteer.emailAddress) {
      volunteer.emailAddress = emailAddress;
    }

    if (address && address !== volunteer.address.fullAddress) {
      const results = getCoordinates(address);
      const lat = results[0].geometry.lat;
      const long = results[0].geometry.lng;

      volunteer.address = {
        fullAddress: address,
        lat,
        long,
      };
    }

    if (contactNumber && contactNumber !== volunteer.contactNumber) {
      volunteer.contactNumber = contactNumber;
    }

    if (
      !volunteer.daysAvailable.every((day) => daysAvailable.includes(day)) ||
      !daysAvailable.every((day) => volunteer.daysAvailable.includes(day))
    ) {
      volunteer.daysAvailable = daysAvailable;
    }

    if (serviceProvided && serviceProvided !== volunteer.serviceProvided) {
      volunteer.serviceProvided = serviceProvided;
    }

    await volunteer.save();

    res.status(200).json({
      msg: "Volunteer updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating volunteer: " + err,
    });
  }
});

export default router;
