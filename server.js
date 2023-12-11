const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app.js");
require("dotenv").config();

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

app.listen(process.env.PORT, () => {
  console.log("Server Is Running On " + process.env.PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
