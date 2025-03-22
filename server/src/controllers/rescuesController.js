const Rescue = require("../models/rescue");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const CustomServerError = require("../errors/CustomServerError");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Application = require("../models/application");
const CustomError = require("../errors/CustomError");
const slugify = require("slugify");

//multer middleware to upload multiple images, used in the createRescue route handler
exports.uploadImages = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 4 },
]);

exports.searchRescues = asyncHandler(async (req, res) => {
  let payload = req.body.payload;

  let search = await Rescue.find({
    name: { $regex: new RegExp("^" + payload + ".*", "i") },
  }).exec();

  search = search.slice(0, 10); //limit the results to 10

  res.status(200).send({ payload: search });
});

exports.getAllRescues = asyncHandler(async (req, res) => {
  const { size } = req.query;

  //assign an object for query parameters
  let query = {};

  if (size) {
    query.size = size;
  }

  const rescues = await Rescue.find({ availability: "available", ...query });

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

  const featureImageUrl = await uploadToCloudinary(req.files.featuredImage[0]);
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

  const result = await rescue.save();

  if (!result) {
    throw new CustomServerError(
      "Oops! We couldn't process your request. Please try again later."
    );
  }

  res.status(201).json({ message: `New Rescue created: ${rescue}` });
});

exports.getNoOfApplications = asyncHandler(async (req, res) => {
  const rescueSlug = req.params.slug;
  console.log(`rescue slug: ${rescueSlug}`);

  const rescue = await Rescue.findOne({ slug: rescueSlug });
  if (!rescue) {
    return res.status(404).json({ message: "Rescue not found" });
  }

  const applicationsCount = await Application.countDocuments({
    rescue: rescue.id,
  });

  console.log(`application count: ${applicationsCount}`);

  res.status(200).json({ applicationsCount });
});

exports.updateRescue = asyncHandler(async (req, res) => {
  const rescueId = req.params.rescueId;
  const updates = req.body;

  // Process name for slug if provided
  if (updates.name) {
    updates.slug = slugify(updates.name, { lower: true, strict: true });
  }

  // Handle file uploads if they exist in the request
  if (req.files) {
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

    // Handle feature image upload if provided
    if (req.files.featureImage && req.files.featureImage.length > 0) {
      const featureImageUrl = await uploadToCloudinary(
        req.files.featureImage[0]
      );
      if (featureImageUrl) {
        updates.featureImage = featureImageUrl;
      } else {
        throw new CustomServerError("Error uploading feature image");
      }
    }

    // Handle gallery images upload if provided
    if (req.files.galleryImages && req.files.galleryImages.length > 0) {
      const uploadPromises = req.files.galleryImages.map((file) =>
        uploadToCloudinary(file)
      );

      try {
        const galleryImageUrls = await Promise.all(uploadPromises);
        updates.galleryImages = galleryImageUrls;
      } catch (error) {
        throw new CustomServerError("Error uploading gallery images");
      }
    }
  }

  // Update rescue with all fields from the request
  const updatedRescue = await Rescue.findByIdAndUpdate(
    rescueId,
    { $set: updates },
    {
      new: true,
      runValidators: false,
    }
  );

  if (!updatedRescue) {
    throw new CustomError("Rescue to be updated not found!", 404);
  }

  console.log(`updated rescue: ${updatedRescue}`);

  res.status(200).json(updatedRescue);
});

//delete rescue
exports.deleteRescue = asyncHandler(async (req, res) => {
  const rescueId = req.params.rescueId;

  const rescue = await Rescue.findByIdAndDelete(rescueId);

  if (!rescue) {
    throw new CustomError("Rescue to delete not found", 404);
  }

  //delete associated applications
  await Application.deleteMany({ rescue: rescueId });

  res.status(204).send();
});
