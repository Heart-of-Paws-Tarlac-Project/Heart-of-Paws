const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log(`before hashing: ${password}`);

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
  };

  const result = await User.create(user);

  if (!result) {
    throw new CustomServerError(
      `Oops! We couldn't process your request in creating a new user. Please try again.`
    );
  }
  console.log("Successfully created user!");
  res.status(201).json({
    message: `User ${user.name} successfully registered`,
    success: true,
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { emailInput, passwordInput } = req.body;
  console.log(emailInput);
  console.log(passwordInput);

  const user = await User.findOne({ email: emailInput });
  if (!user || !(await bcrypt.compare(passwordInput, user.password)))
    throw new CustomNotFoundError("Invalid email or password");

  const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY;

  co;

  const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: 120,
    subject: user.id,
  });
});
