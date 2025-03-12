const Rescue = require("../models/rescue");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const CustomServerError = require("../errors/CustomServerError");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = upload.single("imgSrc");

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
      `Rescue with the name of ${rescueSlug} is not found.`
    );
  }

  res.status(200).json(rescue);
});

// exports.createRescue = asyncHandler(async (req, res) => {
//   //destructure these fields from the request body
//   const { name, sex, age, size, vetStatus, description } = req.body;

//   //create a new instance of the rescue model with the provided data
//   const rescue = new Rescue({ name, sex, age, size, vetStatus, description });

//   const result = await rescue.save();

//   if (!result) {
//     throw new CustomNotFoundError(
//       "Bad request encountered in creating new rescue."
//     );
//   }

//   res.status(201).send(`New Rescue created: ${rescue.name}`);
// });

exports.createRescue = asyncHandler(async (req, res) => {
  const { name, sex, age, size, vetStatus, description } = req.body;

  //multer resolves image upload to req.file
  if (!req.file) {
    throw new CustomNotFoundError("No image uploaded");
  }

  // wrap function to upload to cloudinary inside a promise, cloudinary upload requires a callback function to handle if upload goes well or wrong. if upload goes well, resolve the upload (promise) to result which in turn is assigned to uploadResult. if upload goes wrong, reject the promise and an error is thrown which is catched by asyncHandler.
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "rescuesImages" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(req.file.buffer);
  });

  //create new instance of rescue model to allow the use of .save() instead of plane insertOne() to trigger the middleware which creates slugs for each document in the db.
  const rescue = new Rescue({
    name,
    sex,
    age,
    size,
    vetStatus,
    description,
    imgSrc: uploadResult.secure_url,
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
