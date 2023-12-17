const mongoose = require("mongoose");
const Order = require("./models/orderModel");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app.js");
require("dotenv").config();
const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

let DB;

if (process.env.NODE_ENV === "production") {
  DB = process.env.MONGODB_PROD;
} else {
  DB = process.env.MONGODB_PROD;
}

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((e) => console.log(e));

http.listen(process.env.PORT, () => {
  console.log("Server Is Running On " + process.env.PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  http.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  http.close(() => {
    console.log("💥 Process terminated!");
  });
});

exports.updateOrderStatus = async (orderId) => {
  const filter = {
    _id: orderId,
    status: "pending", // Update the status based on your actual status values
    updatedAt: { $lte: new Date(Date.now() - 30 * 1000) }, // Check if updatedAt is older than 30 seconds
  };

  const update = {
    $set: {
      status: "unknown", // Set the status to "unknown"
    },
  };

  const options = { new: true };

  const updatedOrder = await Order.findOneAndUpdate(filter, update, options);

  if (updatedOrder) {
    console.log(
      'Order status updated to "unknown" successfully:',
      updatedOrder
    );
    socketIO.emit("tableRefetch");
  } else {
    console.log(
      'Order status not updated within the last 30 seconds or not in "pending" state.'
    );
  }
};

socketIO.on("connection", (socket) => {
  //
  socket.on("updatePrice", () => {
    socketIO.emit("updatedPrice_fetch");
  });

  socket.on("confirmOrder", () => {
    socketIO.emit("tableRefetch");
  });

  socket.on("orderSubmit", () => {
    socketIO.emit("tableRefetch");
  });

  console.log("🔥: A user connected");
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});
