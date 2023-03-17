import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  dependentMember: {
    type: mongoose.SchemaTypes.ObjectId, 
    default: "",
    required: true,
    ref: "Member", 
  },
  relationshipToMember: {
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

caregiverSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Caregiver = mongoose.model("Caregiver", caregiverSchema);

export default Caregiver;
