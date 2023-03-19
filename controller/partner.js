import express from "express";
import Partner from "../model/Partner.js";
import { auth } from "../service/auth.js";
import { getCoordinates } from "../service/location.js";
import { encryptPassword } from "../service/passwordEncrypt.js";
import { checkUserExists } from "../service/user.js";

const router = express.Router();

router.post("/signup", [encryptPassword], async (req, res) => {
  const {
    businessName,
    emailAddress,
    address,
    contactNumber,
    password,
    daysAvailable,
    serviceType,
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

    await Partner.create({
      businessName,
      emailAddress,
      address: {
        fullAddress: address,
        lat,
        long,
      },
      contactNumber,
      password,
      daysAvailable,
      serviceType,
    });

    res.status(201).json({
      message: "Partner sign up successful!",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating partner: " + err,
    });
  }
});

router.put("/update", [auth], async (req, res) => {
  const { userId } = req;

  const {
    businessName,
    emailAddress,
    address,
    contactNumber,
    daysAvailable,
    serviceType,
  } = req.body;

  try {
    const partner = await Partner.findById(userId);

    if (!partner) {
      res.status(404).json({
        msg: "Partner not found",
      });
    }

    if (businessName && businessName !== partner.businessName) {
      partner.businessName = businessName;
    }

    if (emailAddress && emailAddress !== partner.emailAddress) {
      partner.emailAddress = emailAddress;
    }

    if (address && address !== partner.address.fullAddress) {
      const results = await getCoordinates(address);
      const lat = results[0].geometry.lat;
      const long = results[0].geometry.lng;

      partner.address.fullAddress = address;
      partner.address.lat = lat;
      partner.address.long = long;
    }

    if (contactNumber !== partner.contactNumber) {
      partner.contactNumber = contactNumber;
    }

    if (!daysAvailable.every((day) => partner.daysAvailable.includes(day))) {
      partner.daysAvailable = daysAvailable;
    }

    if (serviceType && serviceType !== partner.serviceType) {
      partner.serviceType = serviceType;
    }

    await partner.save();

    res.status(200).json({
      msg: "Partner updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating partner: " + err,
    });
  }
});

export default router;
