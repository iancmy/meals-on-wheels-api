import express from "express";
import Caregiver from "../model/Caregiver.js";
import Member from "../model/Member.js";
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
    relationshipToMember,
    memberDetails,
  } = req.body;

  // Check if user exists
  const userExists = await checkUserExists(emailAddress);
  if (userExists) {
    return res.status(400).json({ msg: "User already exists." });
  }

  try {
    const memberAddressCoords = await getCoordinates(address);
    const memberLat = memberAddressCoords[0].geometry.lat;
    const memberLong = memberAddressCoords[0].geometry.lng;

    const member = await Member.create({
      firstName: memberDetails.firstName,
      lastName: memberDetails.lastName,
      birthdate: memberDetails.birthdate,
      emailAddress,
      address: {
        fullAddress: address,
        lat: memberLat,
        long: memberLong,
      },

      contactNumber: memberDetails.contactNumber,
      dietaryRestrictions: memberDetails.dietaryRestrictions,
      foodAllergies: memberDetails.foodAllergies,
      password,
    });

    const caregiverAddressCoords = await getCoordinates(address);
    const caregiverLat = caregiverAddressCoords[0].geometry.lat;
    const caregiverLong = caregiverAddressCoords[0].geometry.lng;

    await Caregiver.create({
      firstName,
      lastName,
      emailAddress,
      address: {
        fullAddress: address,
        lat: caregiverLat,
        long: caregiverLong,
      },
      contactNumber,
      password,
      relationshipToMember,
      dependentMember: member._id,
    });

    res.status(201).json({
      message: "Caregiver sign up successful!",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error creating caregiver: " + err,
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
    relationshipToMember,
    memberDetails,
  } = req.body;

  try {
    const caregiver = await Caregiver.findById(userId);

    if (!caregiver) {
      return res.status(404).json({ msg: "Caregiver not found" });
    }

    if (firstName && firstName !== caregiver.firstName) {
      caregiver.firstName = firstName;
    }

    if (lastName && lastName !== caregiver.lastName) {
      caregiver.lastName = lastName;
    }

    if (emailAddress && emailAddress !== caregiver.emailAddress) {
      caregiver.emailAddress = emailAddress;
    }

    if (address && address !== caregiver.address.fullAddress) {
      const addressCoords = await getCoordinates(address);
      const lat = addressCoords[0].geometry.lat;
      const long = addressCoords[0].geometry.lng;

      caregiver.address = {
        fullAddress: address,
        lat,
        long,
      };
    }

    if (contactNumber && contactNumber !== caregiver.contactNumber) {
      caregiver.contactNumber = contactNumber;
    }

    if (
      relationshipToMember &&
      relationshipToMember !== caregiver.relationshipToMember
    ) {
      caregiver.relationshipToMember = relationshipToMember;
    }

    if (memberDetails) {
      const member = await Member.findById(caregiver.dependentMember);

      if (!member) {
        return res.status(404).json({ msg: "Dependent member not found" });
      }

      if (
        memberDetails.firstName &&
        memberDetails.firstName !== member.firstName
      ) {
        member.firstName = memberDetails.firstName;
      }

      if (
        memberDetails.lastName &&
        memberDetails.lastName !== member.lastName
      ) {
        member.lastName = memberDetails.lastName;
      }

      if (
        memberDetails.birthdate &&
        memberDetails.birthdate !== member.birthdate
      ) {
        member.birthdate = memberDetails.birthdate;
      }

      if (
        memberDetails.emailAddress &&
        memberDetails.emailAddress !== member.emailAddress
      ) {
        member.emailAddress = memberDetails.emailAddress;
      }

      if (
        memberDetails.address &&
        memberDetails.address !== member.address.fullAddress
      ) {
        const addressCoords = await getCoordinates(memberDetails.address);
        const lat = addressCoords[0].geometry.lat;
        const long = addressCoords[0].geometry.lng;

        member.address = {
          fullAddress: memberDetails.address,
          lat,
          long,
        };
      }

      if (
        memberDetails.contactNumber &&
        memberDetails.contactNumber !== member.contactNumber
      ) {
        member.contactNumber = memberDetails.contactNumber;
      }

      if (
        !memberDetails.dietaryRestrictions.every((restriction) =>
          member.dietaryRestrictions.includes(restriction)
        )
      ) {
        member.dietaryRestrictions = memberDetails.dietaryRestrictions;
      }

      if (
        !memberDetails.foodAllergies.every((allergy) =>
          member.foodAllergies.includes(allergy)
        )
      ) {
        member.foodAllergies = memberDetails.foodAllergies;
      }

      await member.save();
    }

    await caregiver.save();

    res.status(200).json({
      message: "Caregiver updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating caregiver: " + err,
    });
  }
});

export default router;
