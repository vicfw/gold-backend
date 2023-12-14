const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, orderController.getAllOrders);

router
  .route("/:id")
  .get(authController.protect, orderController.getOrderById)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.updateOrderById
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.deleteOrderById
  );

module.exports = router;
