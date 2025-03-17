const Inquiry = require("../models/inquiry");
const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");

exports.createInquiry = asyncHandler(async (req, res) => {
  const { name, email, phoneNo, inquiry } = req.body;

  const newInquiry = new Inquiry({
    user: req.session.user.id,
    senderName: name,
    senderEmail: email,
    senderPhoneNo: phoneNo,
    inquiry: inquiry,
  });

  const result = await newInquiry.save();

  if (!result) {
    throw new CustomError("Error creating inquiry", 500);
  }

  res.status(201).send({ message: "Inquiry created successfully" });
});
