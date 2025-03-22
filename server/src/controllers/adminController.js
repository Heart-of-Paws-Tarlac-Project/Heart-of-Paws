const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");
const Application = require("../models/application");
const Rescue = require("../models/rescue");
const Inquiry = require("../models/inquiry");
const sendEmail = require("../utils/sendEmail");

exports.approveOrRejectApplication = asyncHandler(async (req, res) => {
  const applicationId = req.params.applicationId;
  console.log(`application id: ${applicationId}`);
  const status = req.body.status;
  console.log(`status: ${status}`);

  if (!["approved", "rejected"].includes(status)) {
    throw new CustomError("Invalid status", 400);
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    console.log(`Application: ${application}`);
    throw new CustomError("Application not found", 404);
  }

  application.status = status;
  await application.save();

  if (status === "approved") {
    const rescue = await Rescue.findById(application.rescue);
    console.log(`rescue: ${rescue}`);
    if (!rescue) {
      throw new CustomError("Rescue not found", 404);
    }

    rescue.availability = "adopted";
    await rescue.save();
  }

  res
    .status(200)
    .json({ message: `Application ${status}`, application: application });
});

exports.respondToInquiry = asyncHandler(async (req, res) => {
  const inquiryId = req.params.inquiryId;
  console.log(req.message);

  const { message } = req.body;

  console.log(`inquiry id: ${inquiryId}`);
  console.log(`message: ${message}`);

  const inquiry = await Inquiry.findById(inquiryId);

  if (!inquiry) {
    throw new CustomError("Inquiry not found!", 404);
  }

  const response = {
    message,
    timestap: new Date(),
  };

  if (!inquiry.responses) {
    inquiry.responses = [];
  }

  inquiry.responses.push(response);
  await inquiry.save();

  if (!inquiry) {
    throw new CustomError("Error in saving inquiry", 500);
  }

  sendEmail({
    to: inquiry.senderEmail, // Using the sender's email from the inquiry
    subject: `Re: ${inquiry.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50; text-align: center;">Heart of Paws - ${inquiry.subject}</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
          <p style="margin: 0;"><strong style="color: #333;">Inquiry:</strong> ${inquiry.inquiry}</p>
        </div>
        <div style="background: #eef7ea; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 5px;">
          <p style="margin: 0;"><strong style="color: #333;"></strong> ${message}</p>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #555;">
          Thank you for reaching out to us! <br> 
          <strong>Heart of Paws Team</strong>
        </p>
      </div>
    `,
  }).catch((err) => console.error("Email sending failed:", err));

  res.status(200).json(inquiry);
});
