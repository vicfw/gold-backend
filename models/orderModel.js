const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["sell", "buy"],
      required: [true, "نوع سفارش را وارد کنید"],
    },
    status: {
      type: String,
      enum: ["confirmed", "rejected", "unknown", "pending"],
      required: true,
      default: "pending",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "نقدی 24",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
