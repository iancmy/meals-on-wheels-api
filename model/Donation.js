import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    default: "anonymous",
  },
  donationType: {
    type: String,
    enum: ["one-time", "weekly", "monthly", "quarterly", "annually"],
    required: true,
  },
  amount: {
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
    enum: ["cash", "check", "debit", "credit", "paypal"],
    required: true,
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

donationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
