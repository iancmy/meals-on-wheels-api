import express from "express";
import { checkAdmin } from "../service/admin.js";
import { auth } from "../service/auth.js";
import {
  getCaregiverValidationRate,
  getDonationsByDonor,
  getDonationsByFrequency,
  getMemberAgeRange,
  getMemberValidationRate,
  getTopDonations,
  getTopDonors,
  getTotalBeneficiaries,
  getTotalDonations,
  getTotalVolunteers,
  getVolunteerRetention,
} from "../service/report.js";

const router = express.Router();

// Get donation reports
router.get("/donation", [auth, checkAdmin], async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const options = {
      startDate,
      endDate,
    };

    const totalDonations = await getTotalDonations(options);
    const donationsByFrequency = await getDonationsByFrequency(options);
    const donationsByDonor = await getDonationsByDonor(options);
    const topDonations = await getTopDonations(options);
    const topDonors = await getTopDonors(options);

    res.status(200).json({
      totalDonations,
      donationsByFrequency,
      donationsByDonor,
      topDonations,
      topDonors,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get volunteer reports
router.get("/volunteer", [auth, checkAdmin], async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const options = {
      startDate,
      endDate,
    };

    const totalVolunteers = await getTotalVolunteers(options);
    const volunteerRetention = await getVolunteerRetention(options);

    res.status(200).json({
      totalVolunteers,
      volunteerRetention,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get member and caregiver reports
router.get("/beneficiary", [auth, checkAdmin], async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const options = {
      startDate,
      endDate,
    };

    const totalBeneficiaries = await getTotalBeneficiaries(options);
    const memberValidationRate = await getMemberValidationRate();
    const caregiverValidationRate = await getCaregiverValidationRate();
    const memberAgeRange = await getMemberAgeRange(options);

    res.status(200).json({
      totalBeneficiaries,
      memberValidationRate,
      caregiverValidationRate,
      memberAgeRange,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
