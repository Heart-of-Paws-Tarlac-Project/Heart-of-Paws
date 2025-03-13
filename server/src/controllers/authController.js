const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const bcrypt = require("bcryptjs");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`before hashing: ${password}`);

  const saltRounds = 10; //determine the number of salts

  //function with a callback to generate salt to use with the hash
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(`Error generating a salt: ${err}`);
      return;
    }
    //hash the password with the salt
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error(`Error hashing the password: ${err}`);
      }
      console.log(`Hashed password: ${hash}`);
    });
  });
});


