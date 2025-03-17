const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  applicantName: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rescue: {
    type: Schema.Types.ObjectId,
    ref: "Rescue",
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  appointmentMode: {
    type: String,
    required: true,
    enum: ["online", "in-person"],
  },
  introductionMessage: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true,
  },
  // prefferedDay: {
  //   type: Date,
  //   required: true,
  // },
  // prefferedTime: {
  //   type: String,
  //   required: true,
  
  // },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
