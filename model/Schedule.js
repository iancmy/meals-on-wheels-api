import mongoose from "mongoose";
import sequence from "mongoose-sequence";
import Admin from "./Admin";
import Partner from "./Partner";

const scheduleSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  days: {
    type: [String],
    default: [],
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

scheduleSchema.plugin(sequence, { inc_field: "_id" });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
