const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const CustomError = require("../errors/CustomError");

//load environment variables
require("dotenv").config();

//register controller
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  const existingByName = await User.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  const existingByEmail = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  if (existingByName) {
    throw new CustomError("Username already exists", 400);
  }

  if (existingByEmail) {
    throw new CustomError("Email already exists", 400);
  }

  //determine the number of salts
  //generate salt
  //generate hash
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  const user = {
    name: name,
    email: email,
    password: hash,
    role: role,
  };

  const result = await User.create(user);

  if (!result) {
    throw new CustomError("Error creating user", 500);
  }

  res.status(201).send({
    message: `User ${user.name} successfully registered`,
  });
});

//login controller
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid username or password.", 401);
  }

  req.session.user = { id: user.id, name: user.name, role: user.role };

  res
    .status(200)
    .send({
      message: "User logged in successfully",
      name: req.session.user.name,
    }); //set cookie header will be sent along with the response
});

exports.logout = asyncHandler(async (req, res) => {
  if (!req.session) {
    return res.status(200).send({ message: "No session to logout" });
  }

  req.session.destroy((err) => {
    if (err) {
      throw new CustomError("Failed to logout user, please try again", 500);
    }

    res.status(200).send({ message: "Logout successful." });
  });
});

exports.verifyAuth = asyncHandler(async (req, res) => {
  res.status(200).send({ message: "Authenticated" });
});

exports.verifyAdminAuth = asyncHandler(async (req, res) => {
  res.status(200).send({ message: "Admin Authenticated" });
});
