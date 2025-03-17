const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  senderPhoneNo: {
    type: String,
    required: true,
  },
  inquiry: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true,
  },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
