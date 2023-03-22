import bcrypt from "bcrypt";

import Admin from "../model/Admin.js";
import Caregiver from "../model/Caregiver.js";
import Member from "../model/Member.js";
import Partner from "../model/Partner.js";
import Volunteer from "../model/Volunteer.js";

// Helper function to check if user exists
export const checkUserExists = async (emailAddress) => {
  try {
    return (
      (await Member.exists({ emailAddress })) ||
      (await Caregiver.exists({ emailAddress })) ||
      (await Volunteer.exists({ emailAddress })) ||
      (await Partner.exists({ emailAddress })) ||
      (await Admin.exists({ emailAddress }))
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Middleware to set user type
export const getUserType = async (req, res, next) => {
  const { emailAddress } = req.body;
  let userType = null;

  try {
    // Check if user exist in any of the user collections
    (await Member.exists({ emailAddress }))
      ? (userType = "member")
      : (await Caregiver.exists({ emailAddress }))
      ? (userType = "caregiver")
      : (await Volunteer.exists({ emailAddress }))
      ? (userType = "volunteer")
      : (await Partner.exists({ emailAddress }))
      ? (userType = "partner")
      : (await Admin.exists({ emailAddress }))
      ? (userType = "admin")
      : (userType = null);

    // Check if user exists
    if (!userType) {
      return res.status(404).json({
        msg: `User with an email address of ${emailAddress} does not exist.`,
      });
    }

    if (userType === "member") {
      // Check if dependent
      const isDependent = await Caregiver.exists({ emailAddress });

      if (isDependent) {
        userType = "caregiver";
      }
    }

    // Set user type
    req.userType = userType;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Middleware to check if password is correct
export const checkPassword = async (req, res, next) => {
  const { userType } = req;
  const { emailAddress, password } = req.body;

  // Get user data
  let userData = null;

  try {
    switch (userType) {
      case "member":
        userData = await Member.findOne({ emailAddress });
        break;
      case "caregiver":
        userData = await Caregiver.findOne({ emailAddress });
        break;
      case "volunteer":
        userData = await Volunteer.findOne({ emailAddress });
        break;
      case "partner":
        userData = await Partner.findOne({ emailAddress });
        break;
      case "admin":
        userData = await Admin.findOne({ emailAddress });
        break;
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ msg: "Incorrect password. Please try again." });
    }

    req.userId = userData._id;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Middleware to get user data
export const getUserData = async (req, res, next) => {
  const { userId } = req;

  try {
    const userType = (await Member.exists({ _id: userId }))
      ? "member"
      : (await Caregiver.exists({ _id: userId }))
      ? "caregiver"
      : (await Volunteer.exists({ _id: userId }))
      ? "volunteer"
      : (await Partner.exists({ _id: userId }))
      ? "partner"
      : (await Admin.exists({ _id: userId }))
      ? "admin"
      : null;

    if (!userType) {
      return res.status(404).json({ msg: "User does not exist." });
    }

    // Get user data
    const userData =
      (await Member.findById(userId)) ??
      (await Caregiver.findById(userId).populate("dependentMember")) ??
      (await Volunteer.findById(userId)) ??
      (await Partner.findById(userId)) ??
      (await Admin.findById(userId));

    // Set user data
    req.userData = { ...userData._doc, userType };
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
