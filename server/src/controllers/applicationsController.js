const Application = require("../models/application");
const asyncHandler = require("express-async-handler");
const CustomError = require("../errors/CustomError");
const Rescue = require("../models/rescue");
const moment = require("moment");

const VALID_TIME_SLOTS = ["11:00 AM - 1:00 PM", "3:00 PM - 5:00 PM"];

// Create application
exports.createApplication = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const rescue = await Rescue.findOne({ slug: req.params.slug });

  if (!rescue) throw new CustomError("Rescue not found", 404);

  const { interviewDate, interviewTime, ...formData } = req.body;

  // Validate date and time
  if (!moment(interviewDate).isSame(new Date(), "month")) {
    throw new CustomError("Date must be within the current month", 400);
  }

  if (!VALID_TIME_SLOTS.includes(interviewTime)) {
    throw new CustomError("Invalid time slot", 400);
  }

  // ✅ Check for existing booking at the same date and time (across ALL rescues and users)
  const existingSchedule = await Application.findOne({
    interviewDate,
    interviewTime,
  });

  if (existingSchedule) {
    throw new CustomError(
      "This time slot is already booked by another application",
      400
    );
  }

  const duplicateApplication = await Application.findOne({
    user: userId,
    rescue: rescue._id,
  });

  if (duplicateApplication) {
    throw new CustomError(`You have already applied for ${rescue.name}.`, 400);
  }

  // Create and save application
  const application = new Application({
    ...formData,
    user: userId,
    rescue: rescue._id,
    interviewDate,
    interviewTime,
  });

  await application.save();
  res.status(201).json({ message: "Application created successfully" });
});

// Get available dates and slots for current month
exports.getAvailableDates = asyncHandler(async (req, res) => {
  const validTimeSlots = ["11:00 AM - 1:00 PM", "3:00 PM - 5:00 PM"];

  // Get all booked slots for the current month (across all rescues)
  const bookedSlots = await Application.find({
    interviewDate: {
      $gte: moment().startOf("month").toDate(),
      $lte: moment().endOf("month").toDate(),
    },
  });

  // Build a map of booked dates and time slots
  const bookedDates = {};
  bookedSlots.forEach((slot) => {
    const date = moment(slot.interviewDate).format("YYYY-MM-DD");
    if (!bookedDates[date]) {
      bookedDates[date] = [];
    }
    bookedDates[date].push(slot.interviewTime);
  });

  // Generate available slots for the current month
  const availableDates = [];
  const startDate = moment().startOf("month");
  const endDate = moment().endOf("month");

  for (let day = startDate; day.isBefore(endDate); day.add(1, "day")) {
    const date = day.format("YYYY-MM-DD");
    const availableSlots = validTimeSlots.filter(
      (slot) => !(bookedDates[date] || []).includes(slot)
    );

    if (availableSlots.length > 0) {
      availableDates.push({
        date,
        availableSlots,
      });
    }
  }

  res.status(200).json({ availableDates });
});

// Delete application
exports.deleteApplication = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;
  const userId = req.session.user.id;

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new CustomError("Application not found", 404);
  }

  if (application.user.toString() !== userId.toString()) {
    throw new CustomError("Unauthorized request to delete application", 401);
  }

  const result = await Application.deleteOne({ _id: applicationId });

  if (!result) {
    throw new CustomError("Error in deleting application", 500);
  }

  res.status(204).send();
});
