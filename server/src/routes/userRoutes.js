const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");

//route to get user profile
router.get("/:id", isAuthenticated, userController.getUserProfile);
router.patch(
  "/:id/profile-image",
  isAuthenticated,
  userController.uploadProfileImage,
  userController.updateProfileImage
);

module.exports = router;
