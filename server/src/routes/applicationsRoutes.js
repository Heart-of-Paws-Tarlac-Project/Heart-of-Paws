const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

//create application
router.post(
  "/inquire/:slug",
  isAuthenticated,
  applicationsController.createApplication
);




module.exports = router;
