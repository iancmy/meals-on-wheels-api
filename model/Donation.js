import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const donationSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  donorName: {
    type: String,
  },
  donationType: {
    type: String,
    enum: ["Cash Donations", "Corporate Donations", "Gifts", "Volunteer Service Donations", "Fundraising Event Donations", "Government Grants"],
  },
  Amount: {
    type: Number,
    default: 0.0,
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
  },
  contactNumber: {
    type: String,
    default: "",
  },
  paymentMethod: {},
  comment: {
    type: String,
  },
});

donationSchema.plugin(sequence, { inc_field: "_id" });

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
