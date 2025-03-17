const express = require("express");
const router = express.Router();
const inquiriesController = require("../controllers/inquiriesController");
const isAuthenticated = require("../middlewares/isAuthenticated");

//create inquiry
router.post("/", isAuthenticated, inquiriesController.createInquiry);

module.exports = router;    

