import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const partnerSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
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
  daysAvailable: {
    type: [String],
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["Home Health Care", "Transportation Services", "Social Services"], // Shouldn't it be "restaurant" or "grocery"?
    required: true,
  },
});

partnerSchema.plugin(sequence, { inc_field: "_id" });

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
