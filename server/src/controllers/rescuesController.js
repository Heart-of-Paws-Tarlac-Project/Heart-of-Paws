const Rescue = require("../models/rescue");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const CustomServerError = require("../errors/CustomServerError");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Application = require("../models/application");

//multer middleware to upload multiple images, used in the createRescue route handler
exports.uploadImages = upload.fields([
  { name: "featureImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 3 },
]);

exports.getAllRescues = asyncHandler(async (req, res) => {
  const rescues = await Rescue.find({});

  if (!rescues) {
    throw new CustomNotFoundError("No rescues found.");
  }

  res.status(200).json(rescues);
});

exports.getRescue = asyncHandler(async (req, res) => {
  const rescueSlug = req.params.slug;

  const rescue = await Rescue.findOne({ slug: rescueSlug });

  if (!rescue) {
    throw new CustomNotFoundError(
      `Rescue with the name of ${rescueSlug} was not found.`
    );
  }

  res.status(200).json(rescue);
});

exports.createRescue = asyncHandler(async (req, res) => {
  const { name, sex, age, size, vetStatus, description } = req.body;

  //multer resolves image upload to req.file
  if (!req.files) {
    throw new CustomNotFoundError("No images uploaded");
  }

  const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "rescuesImages" }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  };

  // Upload feature image - this will be a single file
  const featureImageUrl = await uploadToCloudinary(req.files.featureImage[0]);
  if (!featureImageUrl)
    throw new CustomNotFoundError("Error uploading feature image");

  // Initialize array for gallery images
  let galleryImageUrls = [];

  if (req.files.galleryImages && req.files.galleryImages.length > 0) {
    // Create an array of promises for each gallery image upload
    const uploadPromises = req.files.galleryImages.map((file) =>
      uploadToCloudinary(file)
    );
    galleryImageUrls = await Promise.all(uploadPromises);
  }
  /**
   * Promise.all() takes an array of promises and returns a single Promise
   * This Promise resolves when all the promises in the array have resolved
   * The resolved value is an array of the resolved values from each promise
   *
   * This allows us to upload multiple images concurrently rather than sequentially,
   * significantly improving performance as we're not waiting for each upload to finish
   * before starting the next one.
   *
   * If any of the promises reject, Promise.all() will immediately reject with that error
   */

  //create new instance of rescue model to allow the use of .save() instead of plain insertOne() to trigger the middleware which creates slugs for each document in the db.
  const rescue = new Rescue({
    name,
    sex,
    age,
    size,
    vetStatus,
    description,
    featureImage: featureImageUrl,
    galleryImages: galleryImageUrls,
  });

  console.log(`Rescue data: ${rescue}`);

  const result = await rescue.save();

  if (!result) {
    throw new CustomServerError(
      "Oops! We couldn't process your request. Please try again later."
    );
  }

  res.status(201).send(`New Rescue created: ${rescue}`);
});

exports.getNoOfApplications = asyncHandler(async (req, res) => {
  const rescueId = req.params.id;
  console.log(`rescue id: ${rescueId}`);

  // Find the rescue by id
  const rescue = await Rescue.findOne({ _id: rescueId });
  if (!rescue) {
    return res.status(404).json({ message: "Rescue not found" });
  }

  // Count the number of applications for the rescue
  const applicationCount = await Application.countDocuments({
    rescue: rescue.id,
  });

  res.status(200).json({
    rescue: rescue.name,
    applicationCount,
  });
});
