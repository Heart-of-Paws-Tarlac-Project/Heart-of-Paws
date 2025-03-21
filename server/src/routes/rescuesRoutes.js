const express = require("express");
const router = express.Router();
const rescuesController = require("../controllers/rescuesController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

//public routes
router.get("/", rescuesController.getAllRescues);
//fetch single rescue
router.get("/:slug", rescuesController.getRescue);
//fetch rescues by size

//admin routes
//create rescue
router.post(
  "/createRescue",
  isAdmin,
  rescuesController.uploadImages,
  rescuesController.createRescue
);
//get total no of applications for rescue
router.get(
  "/:rescueId/applications",
  isAdmin,
  rescuesController.getNoOfApplications
);
//update rescue details
router.patch(
  "/:rescueId",
  isAdmin,
  rescuesController.uploadImages,
  rescuesController.updateRescue
);


module.exports = router;
