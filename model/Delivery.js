import mongoose from "mongoose";
import Caregiver from "./Caregiver";
import Member from "./Member";
import Partner from "./Partner";
import Volunteer from "./Volunteer";

const deliverySchema = new mongoose.Schema({
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Order Received",
      "Food Preparation",
      "Delivered",
      "Cancelled",
      "Rescheduled",
      "No Show",
    ],
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
  validated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
  },
});

deliverySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
