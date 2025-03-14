const express = require("express");
const router = express.Router();
const rescuesController = require("../controllers/rescuesController");

router.get("/", rescuesController.getAllRescues);
router.get("/:slug", rescuesController.getRescue);
router.post(
  "/",
  rescuesController.uploadImages,
  rescuesController.createRescue
);

module.exports = router;
