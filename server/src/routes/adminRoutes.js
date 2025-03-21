const express = require("express");
const router = express.Router();
const Applications = require("../models/application");
const isAdmin = require("../middlewares/isAdmin");
const adminController = require("../controllers/adminController");

//approve or reject an application
router.patch(
  "/applications/:applicationId/status",
  adminController.approveOrRejectApplication
);

module.exports = router;
