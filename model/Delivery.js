import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "cancelled", "rescheduled", "completed"],
    required: true,
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  deliveredFor: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Member",
  },
  caregiver: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null,
    ref: "Caregiver",
  },
  deliveredBy: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Volunteer",
  },
  partner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Partner",
  },
  comment: {
    type: String,
    default: "",
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

deliverySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
