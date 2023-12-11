const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["sell", "buy"],
    required: [true, "نوع سفارش را وارد کنید"],
  },
  status: {
    type: String,
    enum: ["confirmed", "rejected", "unknown"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: number,
    required: true,
  },
  description: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
