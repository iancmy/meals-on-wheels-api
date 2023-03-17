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
  let userExists = false;
  let userType = null;

  try {
    // Check if user exist in any of the user collections
    userExists = await Member.exists({ emailAddress });
    if (userExists) {
      userType = "member";
    }

    userExists = await Caregiver.exists({ emailAddress });
    if (userExists) {
      userType = "caregiver";
    }

    userExists = await Volunteer.exists({ emailAddress });
    if (userExists) {
      userType = "volunteer";
    }

    userExists = await Partner.exists({ emailAddress });
    if (userExists) {
      userType = "partner";
    }

    userExists = await Admin.exists({ emailAddress });
    if (userExists) {
      userType = "admin";
    }

    // Check if user exists
    if (!userExists) {
      return res.status(404).json({ msg: "User does not exist." });
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
  const { password } = req.body;

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
      return res.status(401).json({ msg: "Invalid credentials." });
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

  // Get user data
  let userData = null;

  try {
    switch (userType) {
      case "member":
        userData = await Member.findById(userId).select("-password");
        break;
      case "caregiver":
        userData = await Caregiver.findById(userId)
          .select("-password")
          .populate("member");
        break;
      case "volunteer":
        userData = await Volunteer.findById(userId).select("-password");
        break;
      case "partner":
        userData = await Partner.findById(userId).select("-password");
        break;
      case "admin":
        userData = await Admin.findById(userId).select("-password");
        break;
    }

    // Set user data
    req.userData = userData;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
