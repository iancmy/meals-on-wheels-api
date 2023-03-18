import express from "express";
import Caregiver from "../model/Caregiver";
import Member from "../model/Member.js"; 

const router = express.Router();

// TODO: Add authentication middleware
// For admins only
router.get("/", async (req, res) => {
  try {
    const caregivers = await Caregiver.find();
    res.status(200).json(caregivers);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {
  const query = { $text: { $search: req.body.memberEmailAddress } };
  try {
    if(req.body.memberEmailAddress == req.body.emailAddress &&  req.body.memberPassword == req.body.password){
      console.log("Email Address and Password is not equal with memeber");
    } else {
      const members = await Member.find(query);
      if(members != null){
        
        const memberInfo = await Member.create({
          firstName: req.body.memberFirstName,
          lastName: req.body.memberLastName,
          birthdate: req.body.memberBirthdate,
          emailAddress: req.body.memberEmailAddress,
          address: {
            fullAddress: req.body.memberAddress,
          },
          contactNumber: req.body.memberContactNumber,
          dietaryRestrictions: req.body.memberDietaryRestrictions,
          foodAllergies: req.body.memberFoodAllergies,
          password: req.body.memberPassword,
        });
    
        await Caregiver.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
          address: {
            fullAddress: req.body.address,
          },
          contactNumber: req.body.contactNumber,
          password: req.body.password,
          dependentMember: memberInfo._id,
          relationshipToMember: req.body.relationshipToMember,
        });
      } else {
        return res.redirect('/login');
      }
    }
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    message: "Caregiver created!",
  });
});

export default router;
