import mongoose from "mongoose";
import Admin from "./Admin";
import Partner from "./Partner";

const scheduleSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  days: {
    type: [String],
    required: true,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  partner: {
    type: Partner,
    default: "",
  },
  createdBy: {
    type: Admin,
    default: "",
  },
  createdAt: {
    type: Date,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
