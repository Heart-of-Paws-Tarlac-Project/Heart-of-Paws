const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");
const Application = require("../models/application");
const Rescue = require("../models/rescue");

exports.approveOrRejectApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new CustomError("Invalid status", 400);
  }

  const application = await Application.findById(applicationId);
  if (!application) {
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
