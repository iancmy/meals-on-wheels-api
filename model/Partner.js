import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
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
  daysAvailable: {
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
  serviceType: {
    type: String,
    enum: ["restaurant", "grocery"],
    required: true,
  },
  validated: {
    type: Boolean,
    default: false,
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

partnerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
