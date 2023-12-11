const express = require("express");
const priceController = require("../controller/priceController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    priceController.updatePrice
  );

router
  .route("/current")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    priceController.getCurrentPrice
  );

module.exports = router;
