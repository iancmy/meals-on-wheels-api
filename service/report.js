import Member from "../model/Member.js";
import Volunteer from "../model/Volunteer.js";
import Donation from "../model/Donation.js";

function getOptions(options) {
  const { startDate, endDate } = options;

  const match = {};

  if (startDate && endDate) {
    match.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else if (startDate) {
    match.createdAt = {
      $gte: new Date(startDate),
    };
  } else if (endDate) {
    match.createdAt = {
      $lte: new Date(endDate),
    };
  }

  return match;
}

function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const getTotalDonations = async (options) => {
  try {
    const totalDonations = await Donation.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return totalDonations;
  } catch (err) {
    console.log("Error in getTotalDonations service (report.js)");
    console.log(err);
  }
};

export const getDonationsByFrequency = async (options) => {
  try {
    const donationsByFrequency = await Donation.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $group: {
          _id: "$donationType",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return donationsByFrequency;
  } catch (err) {
    console.log("Error in getDonationsByFrequency service (report.js)");
    console.log(err);
  }
};

export const getDonationsByDonor = async (options) => {
  try {
    const donationsByDonor = await Donation.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $group: {
          _id: "$donorName",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return donationsByDonor;
  } catch (err) {
    console.log("Error in getDonationsByDonor service (report.js)");
    console.log(err);
  }
};

export const getTopDonations = async (options) => {
  try {
    const topDonations = await Donation.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $sort: {
          amount: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return topDonations;
  } catch (err) {
    console.log("Error in getTopDonations service (report.js)");
    console.log(err);
  }
};

export const getTopDonors = async (options) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $group: {
          _id: "$donorName",
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return topDonors;
  } catch (err) {
    console.log("Error in getTopDonors service (report.js)");
    console.log(err);
  }
};

export const getTotalVolunteers = async (options) => {
  try {
    const totalVolunteers = await Volunteer.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    return totalVolunteers;
  } catch (err) {
    console.log("Error in getTotalVolunteers service (report.js)");
    console.log(err);
  }
};

export const getVolunteerRetention = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = prevMonth === 12 ? currentYear - 1 : currentYear;
    const matchCurrentMonth = {
      validated: true,
      createdAt: {
        $gte: new Date(`${currentYear}-${currentMonth}-01`),
        $lte: new Date(`${currentYear}-${currentMonth}-31`),
      },
    };
    const matchPrevMonth = {
      validated: true,
      createdAt: {
        $gte: new Date(`${prevYear}-${prevMonth}-01`),
        $lte: new Date(`${prevYear}-${prevMonth}-31`),
      },
    };
    const validatedVolunteersCurrentMonth = await Volunteer.countDocuments(
      matchCurrentMonth
    );
    const validatedVolunteersPrevMonth = await Volunteer.countDocuments(
      matchPrevMonth
    );
    const ratio =
      validatedVolunteersPrevMonth > 0
        ? validatedVolunteersCurrentMonth / validatedVolunteersPrevMonth
        : validatedVolunteersCurrentMonth > 0
        ? 1
        : 0;
    return ratio;
  } catch (err) {
    console.log("Error in getVolunteerRetention service (report.js)");
    console.log(err);
  }
};

export const getTotalBeneficiaries = async (options) => {
  try {
    const totalMembers = await Member.countDocuments({
      validated: true,
    });

    const totalCaregivers = await Caregiver.countDocuments({
      validated: true,
    });

    return {
      totalMembers,
      totalCaregivers,
      totalBeneficiaries: totalMembers - totalCaregivers,
    };
  } catch (err) {
    console.log("Error in getTotalMembersAndCaregivers service (report.js)");
    console.log(err);
  }
};

export const getMemberValidationRate = async () => {
  try {
    const totalMembers = await Member.countDocuments();
    const validatedMembers = await Member.countDocuments({ validated: true });

    const ratio = totalMembers > 0 ? validatedMembers / totalMembers : 0;

    return ratio;
  } catch (err) {
    console.log("Error in getMemberValidationRate service (report.js)");
    console.log(err);
  }
};

export const getCaregiverValidationRate = async () => {
  try {
    const totalCaregivers = await Caregiver.countDocuments();
    const validatedCaregivers = await Caregiver.countDocuments({
      validated: true,
    });

    const ratio =
      totalCaregivers > 0 ? validatedCaregivers / totalCaregivers : 0;

    return ratio;
  } catch (err) {
    console.log("Error in getCaregiverValidationRate service (report.js)");
    console.log(err);
  }
};

export const getMemberAgeRange = async (options) => {
  try {
    // Get member birthdates
    const memberBirthdates = await Member.aggregate([
      {
        $match: getOptions(options),
      },
      {
        $project: {
          birthdate: 1,
        },
      },
    ]);

    // Get age range
    const memberAgeRange = memberBirthdates.reduce(
      (acc, member) => {
        const age = getAge(member.birthdate);
        if (age < 18) {
          acc["0-17"] += 1;
        } else if (age >= 18 && age <= 24) {
          acc["18-24"] += 1;
        } else if (age >= 25 && age <= 34) {
          acc["25-34"] += 1;
        } else if (age >= 35 && age <= 44) {
          acc["35-44"] += 1;
        } else if (age >= 45 && age <= 54) {
          acc["45-54"] += 1;
        } else if (age >= 55 && age <= 64) {
          acc["55-64"] += 1;
        } else if (age >= 65) {
          acc["65+"] += 1;
        }
        return acc;
      },
      {
        "0-17": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45-54": 0,
        "55-64": 0,
        "65+": 0,
      }
    );

    return memberAgeRange;
  } catch (err) {
    console.log("Error in getMemberAgeRange service (report.js)");
    console.log(err);
  }
};
