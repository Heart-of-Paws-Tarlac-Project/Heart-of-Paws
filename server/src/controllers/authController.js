const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const CustomError = require("../errors/CustomError");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

//load environment variables
require("dotenv").config();

//register controller
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  // Check for existing user by name
  const existingByName = await User.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingByName) {
    throw new CustomError("Username already exists", 400);
  }

  // Check for existing user by email
  const existingByEmail = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry

  let user;

  // If email exists but not verified, update the verification token
  if (existingByEmail && !existingByEmail.isVerified) {
    existingByEmail.name = name;
    existingByEmail.password = hash;
    existingByEmail.role = role;
    existingByEmail.verificationToken = verificationToken;
    existingByEmail.verificationTokenExpires = verificationTokenExpires;

    user = await existingByEmail.save();
  } else if (existingByEmail) {
    // If email exists and is verified, don't allow re-registration
    throw new CustomError("Email already exists", 400);
  } else {
    // Create new user if email doesn't exist
    user = await User.create({
      name,
      email,
      password: hash,
      role,
      verificationToken,
      verificationTokenExpires,
    });
  }

  const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: `
      <h3>Welcome to Heart of Paws!</h3>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
    `,
  });

  res.status(201).send({
    message: `User ${user.name} successfully registered. A verification email has been sent to ${user.email}.`,
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

  res.status(200).send({
    message: "User logged in successfully",
    name: req.session.user.name,
    id: req.session.user.id,
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

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  console.log(`Received Token: ${token}`);

  if (!token) {
    throw new CustomError("Invalid token", 400);
  }

  const user = await User.findOne({
    verificationToken: token,
  });

  if (!user) {
    throw new CustomError("Invalid or expired token", 400);
  }

  console.log(`Stored Expiry: ${user.verificationTokenExpires}`);
  console.log(`Current Time: ${new Date(Date.now())}`);

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  res.status(200).send({ message: "Email verified successfully." });
});
