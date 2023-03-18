import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  birthdate: {
    type: Date,
    required: false,
  },
  emailAddress: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // validate email address
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
    lowercase: true,
  },
  address: {
    type: {
      _id: false,
      fullAddress: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        default: null,
      },
      long: {
        type: Number,
        default: null,
      },
    },
    required: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  foodAllergies: {
    type: [String],
    default: [],
  },
  password: {
    type: String,
    required: true,
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

memberSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
