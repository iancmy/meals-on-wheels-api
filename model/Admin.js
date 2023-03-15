import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    default: "",
  },
  permisions: {
    type: [String],
    default: [],
  },
  });

adminSchema.plugin(sequence, { inc_field: "_id"});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
