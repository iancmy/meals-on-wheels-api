import mongoose from "mongoose";
import Member from "./Member";
import sequence from "mongoose-sequence";

const caregiverSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailAddress: {
    type: String,
    required: true,
    validation: {
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
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  dependentMember: {
    type: Member,
    default: "",
  },
  relationshipToMember: {
    type: String,
    default: "",
  },
});

caregiverSchema.plugin(sequence, { inc_field: "_id" });

const Caregiver = mongoose.model("Caregiver", caregiverSchema);

export default Caregiver;
