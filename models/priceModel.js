const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    buy: {
      type: Number,
    },
    sell: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
