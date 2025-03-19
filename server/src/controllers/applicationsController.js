const Application = require("../models/application");
const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");
const Rescue = require("../models/rescue");

//create application
exports.createApplication = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const rescue = await Rescue.findOne({ slug: req.params.slug });
  if (!rescue) {
    throw new CustomError("Rescue not found", 404);
  }

  //if application exists
  const isApplicationExisting = await Application.findOne({
    user: userId,
    rescue: rescue._id,
  });

  if (isApplicationExisting) {
    throw new CustomError("Application already exists", 400);
  }

  const application = new Application({
    applicantName: req.body.name,
    user: req.session.user.id,
    rescue: rescue._id,
    phoneNo: req.body.phoneNo,
    address: req.body.address,
    appointmentMode: req.body.preferredModeOfContact,
    introductionMessage: req.body.introductionMessage,
  });

  const result = await application.save();

  if (!result) {
    throw new CustomError("Error creating application", 500);
  }

  res.status(201).send({ message: "Application created successfully" });
});

exports.deleteApplication = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;
  const userId = req.session.user.id;

  console.log(`userId: ${userId}`);
  console.log(`application id: ${applicationId}`);
  const application = await Application.findById(applicationId);
  if (!application) {
    throw new CustomError("Application to delete not found!", 404);
  }

  if (application.user.toString() !== userId.toString()) {
    throw new CustomError("Unauthorized request to delete application", 401);
  }

  const result = await Application.deleteOne(application);

  if (!result) {
    throw new CustomError("Error in deleting user application", 500);
  }

  res.status(204).send("Application deleted successfully");
});
