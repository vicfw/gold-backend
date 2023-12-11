const Price = require("../models/priceModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.updatePrice = catchAsync(async (req, res, next) => {
  let price = await Price.findOne();

  if (!price) {
    price = await Price.create(req.body);
  } else {
    Object.keys(req.body).forEach((field) => {
      price[field] = req.body[field];
    });

    await price.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      price,
    },
  });
});

exports.getCurrentPrice = catchAsync(async (req, res, next) => {
  const price = await Price.findOne();

  if (!price) {
    return next(new AppError("No price found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      price,
    },
  });
});
