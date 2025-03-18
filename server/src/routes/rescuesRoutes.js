const express = require("express");
const router = express.Router();
const rescuesController = require("../controllers/rescuesController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

//public routes
router.get("/", rescuesController.getAllRescues);
router.get("/:slug", rescuesController.getRescue);

//admin routes
router.post(
  "/createRescue",
  isAuthenticated,
  isAdmin,
  rescuesController.uploadImages,
  rescuesController.createRescue
);

//route to get number of applications
router.get(
  "/rescue/:id",
  isAuthenticated,
  rescuesController.getNoOfApplications
);

module.exports = router;
