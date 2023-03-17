import express from "express";
import { encryptPassword } from "../service/passwordEncrypt.js";

import Admin from "../model/Admin.js";

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

export default router;
