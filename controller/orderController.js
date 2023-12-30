const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const moment = require("moment");

// Create a new order
exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  setTimeout(() => {
    updateOrderStatus(order._id);
  }, 30000);

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

// Get all orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  let query = {};
  // Check if a date parameter is provided in the query string
  if (req.query.createdDate) {
    // Use the provided date directly
    const providedDate = moment(req.query.createdDate, "YYYY-MM-DD", true);

    // If the date is valid, filter orders for that date
    if (providedDate.isValid()) {
      query.createdAt = {
        $gte: new Date(providedDate.startOf("day")),
        $lte: new Date(providedDate.endOf("day")),
      };
    } else {
      return next(new AppError("Invalid date format. Use YYYY-MM-DD.", 400));
    }
  }
  // Query orders based on the constructed query
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("user");

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

// Get an order by ID
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

// Update an order by ID
exports.updateOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

// Delete an order by ID
exports.deleteOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
