import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 52,
  },
  days: {
    type: [
      {
        type: String,
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
    ],
    required: true,
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  partner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Partner",
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Admin",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

scheduleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
