import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    default: "anonymous",
  },
  donationType: {
    type: String,
    enum: ["One Time", "Monthly", "Annual"],
  },
  Amount: {
    type: Number,
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
  paymentMethod: {
    type: String,
    enum: ["Cash", "Check", "Credit Card", "Debit Card", "Paypal"],
  },
  comment: {
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

donationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
