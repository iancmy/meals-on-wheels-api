import mongoose from "mongoose";
import sequence from "mongoose-sequence";
import Caregiver from "./Caregiver";
import Member from "./Member";
import Partner from "./Partner";
import Volunteer from "./Volunteer";

const deliverySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Order Received", "Food Preparation", "Delivered", "Cancelled", "Rescheduled", "No Show"],
    required: true,
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  member: {
    type: Member,
    default: "",
  },
  caregiver: {
    type: Caregiver,
    default: "",
  },
  volunteerRider: {
    type: Volunteer,
    default: "",
  },
  partner: {
    type: Partner,
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
});

deliverySchema.plugin(sequence, { inc_field: "_id" });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
