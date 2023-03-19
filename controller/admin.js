import express from "express";
import { encryptPassword } from "../service/passwordEncrypt.js";

import Admin from "../model/Admin.js";
import Member from "../model/Member.js";
import Caregiver from "../model/Caregiver.js";
import Volunteer from "../model/Volunteer.js";
import Partner from "../model/Partner.js";
import { auth } from "../service/auth.js";
import {
  checkAdmin,
  checkLogistics,
  checkSuperAdmin,
} from "../service/admin.js";
import { checkUserExists } from "../service/user.js";
import { getCoordinates } from "../service/location.js";
import Schedule from "../model/Schedule.js";
import Delivery from "../model/Delivery.js";

const router = express.Router();

// DEV ONLY - Create admin
// router.post("/create", [encryptPassword], async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     emailAddress,
//     password,
//     contactNumber,
//     permissions,
//   } = req.body;

//   try {
//     await Admin.create({
//       firstName,
//       lastName,
//       emailAddress,
//       password,
//       contactNumber,
//       permissions,
//     });

//     res.status(201).json({
//       msg: "Admin created successfully!",
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err });
//   }
// });

// Get all users
router.get("/users", [auth, checkSuperAdmin], async (req, res) => {
  const userType = req.query.type;

  try {
    let users;

    switch (userType) {
      case "admin":
        users = await Admin.find().select("-password");
        res.status(200).json(users);
        break;
      case "member":
        users = await Member.find().select("-password");
        res.status(200).json(users);
        break;
      case "caregiver":
        users = await Caregiver.find().select("-password");
        res.status(200).json(users);
        break;
      case "volunteer":
        users = await Volunteer.find().select("-password");
        res.status(200).json(users);
        break;
      case "partner":
        users = await Partner.find().select("-password");
        res.status(200).json(users);
        break;
      default:
        // return all users
        const admins = await Admin.find().select("-password");
        const members = await Member.find().select("-password");
        const caregivers = await Caregiver.find().select("-password");
        const volunteers = await Volunteer.find().select("-password");
        const partners = await Partner.find().select("-password");

        users = {
          admins,
          members,
          caregivers,
          volunteers,
          partners,
        };
        res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Get user by id
router.get("/user/:id", [auth, checkSuperAdmin], async (req, res) => {
  const userId = req.params.id;

  try {
    const user =
      (await Admin.findById(userId).select("-password")) ??
      (await Member.findById(userId).select("-password")) ??
      (await Caregiver.findById(userId).select("-password")) ??
      (await Volunteer.findById(userId).select("-password")) ??
      (await Partner.findById(userId).select("-password"));

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Create user
router.post(
  "/user",
  [auth, checkSuperAdmin, encryptPassword],
  async (req, res) => {
    const userType = req.query.type;
    const userDetails = req.body;

    // Check if user exists
    const userExists = await checkUserExists(userDetails.emailAddress);
    if (userExists) {
      return res.status(400).json({ msg: "User already exists." });
    }

    try {
      let lat, long;

      if (userDetails?.address) {
        try {
          const results = await getCoordinates(userDetails.address);

          lat = results[0].geometry.lat;
          long = results[0].geometry.lng;
        } catch (err) {
          return res
            .status(400)
            .json({ msg: "Cannot find coordinates of address." });
        }
      }

      switch (userType) {
        case "admin":
          try {
            await Admin.create(userDetails);

            res.status(201).json({
              msg: "Admin created successfully!",
            });
          } catch (err) {
            res.status(500).json({ msg: err });
          }
          break;
        case "member":
          try {
            await Member.create({
              _id:
                new Date().getTime().toString() +
                Math.floor(Math.random() * 1000).toString(),
              ...userDetails,
              address: {
                fullAddress: userDetails.address,
                lat,
                long,
              },
            });

            res.status(201).json({
              msg: "Member created successfully!",
            });
          } catch (err) {
            res.status(500).json({ msg: err });
          }

          break;
        case "caregiver":
          try {
            const memberAddressCoords = await getCoordinates(
              userDetails.memberDetails.address
            );

            const memberLat = memberAddressCoords[0].geometry.lat;
            const memberLong = memberAddressCoords[0].geometry.lng;

            const member = await Member.create({
              ...userDetails.memberDetails,
              address: {
                fullAddress: userDetails.memberDetails.address,
                lat: memberLat,
                long: memberLong,
              },
              emailAddress: userDetails.emailAddress,
              password: userDetails.password,
            });

            try {
              await Caregiver.create({
                ...userDetails,
                dependentMember: member._id,
                address: {
                  fullAddress: userDetails.address,
                  lat,
                  long,
                },
              });

              res.status(201).json({
                msg: "Caregiver created successfully!",
              });
            } catch (err) {
              // Delete member if caregiver creation fails
              await Member.findByIdAndDelete(member._id);

              res.status(500).json({ msg: err });
            }
          } catch (err) {
            res.status(500).json({ msg: err });
          }

          break;
        case "volunteer":
          try {
            await Volunteer.create({
              ...userDetails,
              address: {
                fullAddress: userDetails.address,
                lat,
                long,
              },
            });

            res.status(201).json({
              msg: "Volunteer created successfully!",
            });
          } catch (err) {
            res.status(500).json({ msg: err });
          }

          break;
        case "partner":
          try {
            await Partner.create({
              ...userDetails,
              address: {
                fullAddress: userDetails.address,
                lat,
                long,
              },
            });

            res.status(201).json({
              msg: "Partner created successfully!",
            });
          } catch (err) {
            res.status(500).json({ msg: err });
          }

          break;
        default:
          return res.status(400).json({ msg: "Invalid user type." });
      }
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);

// Update user
router.put("/user/:id", [auth, checkSuperAdmin], async (req, res) => {
  const userId = req.params.id;
  const userDetails = req.body;

  try {
    let lat, long;

    const userType = (await Admin.exists({ _id: userId }))
      ? "admin"
      : (await Member.exists({ _id: userId }))
      ? "member"
      : (await Caregiver.exists({ _id: userId }))
      ? "caregiver"
      : (await Volunteer.exists({ _id: userId }))
      ? "volunteer"
      : (await Partner.exists({ _id: userId }))
      ? "partner"
      : null;

    if (!userType) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (userDetails?.address) {
      const results = await getCoordinates(userDetails.address);
      lat = results[0].geometry.lat;
      long = results[0].geometry.lng;
    }

    const user =
      userType === "admin"
        ? await Admin.findById(userId)
        : userType === "member"
        ? await Member.findById(userId)
        : userType === "caregiver"
        ? await Caregiver.findById(userId)
        : userType === "volunteer"
        ? await Volunteer.findById(userId)
        : userType === "partner"
        ? await Partner.findById(userId)
        : null;

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    switch (userType) {
      case "admin":
        for (const [key, value] of Object.entries(userDetails)) {
          if (Array.isArray(user[key])) {
            if (!user[key].every((item) => value.includes(item))) {
              user[key] = value;
            }
            continue;
          }

          if (user[key] !== value) {
            user[key] = value;
          }
        }
        await user.save();
        break;
      case "member":
        for (const [key, value] of Object.entries(userDetails)) {
          if (Array.isArray(user[key])) {
            if (!user[key].every((item) => value.includes(item))) {
              user[key] = value;
            }
            continue;
          }

          if (key === "address" && user[key].fullAddress !== value) {
            user[key].fullAddress = value;
            user[key].lat = lat;
            user[key].long = long;
            continue;
          }

          if (user[key] !== value) {
            user[key] = value;
          }
        }

        await user.save();
        break;
      case "caregiver":
        const member = await Member.findById(user.dependentMember);

        for (const [key, value] of Object.entries(userDetails.memberDetails)) {
          if (Array.isArray(member[key])) {
            if (!member[key].every((item) => value.includes(item))) {
              member[key] = value;
            }
            continue;
          }

          if (key === "address" && member[key].fullAddress !== value) {
            const memberAddressCoords = await getCoordinates(value);

            const memberLat = memberAddressCoords[0].geometry.lat;
            const memberLong = memberAddressCoords[0].geometry.lng;

            const address = {
              fullAddress: value,
              lat: memberLat,
              long: memberLong,
            };

            member[key] = address;

            continue;
          }

          if (member[key] !== value) {
            member[key] = value;
          }
        }

        await member.save();

        for (const [key, value] of Object.entries(userDetails)) {
          if (Array.isArray(user[key])) {
            if (!user[key].every((item) => value.includes(item))) {
              user[key] = value;
            }
            continue;
          }

          if (key === "address" && user[key].fullAddress !== value) {
            user[key].fullAddress = value;
            user[key].lat = lat;
            user[key].long = long;
            continue;
          }

          if (user[key] !== value) {
            user[key] = value;
          }
        }

        await user.save();

        break;
      case "volunteer":
        for (const [key, value] of Object.entries(userDetails)) {
          if (Array.isArray(user[key])) {
            if (!user[key].every((item) => value.includes(item))) {
              user[key] = value;
            }
            continue;
          }

          if (key === "address" && user[key].fullAddress !== value) {
            user[key].fullAddress = value;
            user[key].lat = lat;
            user[key].long = long;
            continue;
          }

          if (user[key] !== value) {
            user[key] = value;
          }
        }

        await user.save();
        break;
      case "partner":
        for (const [key, value] of Object.entries(userDetails)) {
          if (Array.isArray(user[key])) {
            if (!user[key].every((item) => value.includes(item))) {
              user[key] = value;
            }
            continue;
          }

          if (key === "address" && user[key].fullAddress !== value) {
            user[key].fullAddress = value;
            user[key].lat = lat;
            user[key].long = long;
            continue;
          }

          if (user[key] !== value) {
            user[key] = value;
          }
        }

        await user.save();
        break;
      default:
        return res.status(400).json({ msg: "Invalid user type." });
    }

    res.status(200).json({ msg: "User updated successfully." });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Delete user
router.delete("/user/:id", [auth, checkSuperAdmin], async (req, res) => {
  const userId = req.params.id;

  try {
    const userType = (await Admin.exists({ _id: userId }))
      ? "admin"
      : (await Member.exists({ _id: userId }))
      ? "member"
      : (await Caregiver.exists({ _id: userId }))
      ? "caregiver"
      : (await Volunteer.exists({ _id: userId }))
      ? "volunteer"
      : (await Partner.exists({ _id: userId }))
      ? "partner"
      : null;

    if (!userType) {
      return res.status(404).json({ msg: "User not found." });
    }

    switch (userType) {
      case "admin":
        await Admin.findByIdAndDelete(userId);
        break;
      case "member":
        await Member.findByIdAndDelete(userId);
        break;
      case "caregiver":
        const caregiver = await Caregiver.findById(userId);
        await Caregiver.findByIdAndDelete(userId);
        await Member.findByIdAndDelete(caregiver.dependentMember);
        break;
      case "volunteer":
        await Volunteer.findByIdAndDelete(userId);
        break;
      case "partner":
        await Partner.findByIdAndDelete(userId);
        break;
      default:
        return res.status(400).json({ msg: "Invalid user type." });
    }

    res.status(200).json({ msg: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Validate user
router.post("/user/validate/:id", [auth, checkAdmin], async (req, res) => {
  const { id } = req.params;

  try {
    const user =
      (await Member.findById(id)) ??
      (await Caregiver.findById(id)) ??
      (await Volunteer.findById(id)) ??
      (await Partner.findById(id));

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (user.validated) {
      return res.status(400).json({ msg: "User already validated." });
    }

    const isCaregiver = await Caregiver.exists({ _id: id });

    if (isCaregiver) {
      const member = await Member.findById(user.dependentMember);

      if (!member) {
        return res
          .status(404)
          .json({ msg: "Dependent member of caregiver not found." });
      }

      member.validated = true;

      await member.save();
    }

    user.validated = true;
    await user.save();

    res.status(200).json({ msg: "User validated successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Invalidate user
router.post("/user/invalidate/:id", [auth, checkAdmin], async (req, res) => {
  const { id } = req.params;

  try {
    const user =
      (await Member.findById(id)) ??
      (await Caregiver.findById(id)) ??
      (await Volunteer.findById(id)) ??
      (await Partner.findById(id));

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (!user.validated) {
      return res.status(400).json({ msg: "User already invalidated." });
    }

    const isCaregiver = await Caregiver.exists({ _id: id });
    if (isCaregiver) {
      const member = await Member.findById(user.dependentMember);

      if (!member) {
        return res
          .status(404)
          .json({ msg: "Dependent member of caregiver not found." });
      }

      member.validated = false;

      await member.save();
    }

    user.validated = false;
    await user.save();

    res.status(200).json({ msg: "User invalidated successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Create schedule
router.post("/schedule", [auth, checkLogistics], async (req, res) => {
  const { userId } = req;
  const { weekNumber, days, dietaryRestrictions, partner } = req.body;

  try {
    await Schedule.create({
      weekNumber,
      days,
      dietaryRestrictions,
      partner,
      createdBy: userId,
      lastUpdatedBy: userId,
    });

    res.status(201).json({
      msg: "Schedule created successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Update schedule
router.put("/schedule/:id", [auth, checkLogistics], async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const { weekNumber, days, dietaryRestrictions, partner } = req.body;

  try {
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    if (weekNumber !== schedule.weekNumber) {
      schedule.weekNumber = weekNumber;
    }

    if (!days.every((day) => schedule.days.includes(day))) {
      schedule.days = days;
    }

    if (
      !dietaryRestrictions.every((restriction) =>
        schedule.dietaryRestrictions.includes(restriction)
      )
    ) {
      schedule.dietaryRestrictions = dietaryRestrictions;
    }

    if (partner !== schedule.partner) {
      schedule.partner = partner;
    }

    schedule.lastUpdatedBy = userId;
    await schedule.save();

    res.status(200).json({
      msg: "Schedule updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Delete schedule
router.delete("/schedule/:id", [auth, checkLogistics], async (req, res) => {
  const { id } = req.params;

  try {
    const exists = await Schedule.exists({ _id: id });

    if (!exists) {
      return res.status(404).json({ msg: "Schedule not found." });
    }

    await Schedule.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Schedule deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Get deliveries
router.get("/deliveries", [auth, checkLogistics], async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("partner", "-password")
      .populate("deliveredBy", "-password")
      .populate("deliveredFor", "-password")
      .populate("caregiver", "-password");

    res.status(200).json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Get delivery by id
router.get("/delivery/:id", [auth, checkLogistics], async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await Delivery.findById(id)
      .populate("partner", "-password")
      .populate("deliveredBy", "-password")
      .populate("deliveredFor", "-password")
      .populate("caregiver", "-password");

    if (!delivery) {
      return res.status(404).json({ msg: "Delivery not found." });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Create delivery
router.post("/delivery", [auth, checkLogistics], async (req, res) => {
  const {
    deliveryDate,
    dietaryRestrictions,
    deliveredFor,
    caregiver = null,
    deliveredBy,
    partner,
    comment,
  } = req.body;

  try {
    await Delivery.create({
      status: "pending",
      deliveryDate,
      dietaryRestrictions,
      deliveredFor,
      caregiver,
      deliveredBy,
      partner,
      comment,
    });

    res.status(201).json({
      msg: "Delivery created successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Update delivery
router.put("/delivery/:id", [auth, checkLogistics], async (req, res) => {
  const { id } = req.params;
  const {
    deliveryDate,
    dietaryRestrictions,
    deliveredFor,
    caregiver,
    deliveredBy,
    partner,
    comment,
  } = req.body;

  try {
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ msg: "Delivery not found." });
    }

    if (deliveryDate !== delivery.deliveryDate) {
      delivery.deliveryDate = deliveryDate;
    }

    if (
      !dietaryRestrictions.every((restriction) =>
        delivery.dietaryRestrictions.includes(restriction)
      )
    ) {
      delivery.dietaryRestrictions = dietaryRestrictions;
    }

    if (deliveredFor !== delivery.deliveredFor) {
      delivery.deliveredFor = deliveredFor;
    }

    if (caregiver !== delivery.caregiver) {
      delivery.caregiver = caregiver;
    }

    if (deliveredBy !== delivery.deliveredBy) {
      delivery.deliveredBy = deliveredBy;
    }

    if (partner !== delivery.partner) {
      delivery.partner = partner;
    }

    if (comment !== delivery.comment) {
      delivery.comment = comment;
    }

    await delivery.save();

    res.status(200).json({
      msg: "Delivery updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

// Update delivery status
router.put("/delivery/:id/status", [auth, checkLogistics], async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ msg: "Delivery not found." });
    }

    if (status !== delivery.status) {
      delivery.status = status;
    }

    await delivery.save();

    res.status(200).json({
      msg: "Delivery status updated successfully!",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

export default router;
