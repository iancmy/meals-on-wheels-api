import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const volunteerSchema = new mongoose.Schema({
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
    type: [Number],
    default: [],
  },
  serviceProvided: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"], // Shouldn't it be "delivery" or "logistics"
  },
});

volunteerSchema.plugin(sequence, { inc_field: "_id" });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;
