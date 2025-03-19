const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applicationsController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

//user routes
//create application to adopt a rescue
router.post(
  "/inquire/:slug",
  isAuthenticated,
  applicationsController.createApplication
);
//delete application to adopt a rescue
router.delete("/:id", applicationsController.deleteApplication);

module.exports = router;
