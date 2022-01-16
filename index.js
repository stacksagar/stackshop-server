// for environment variables work
require("dotenv").config();

// import packages
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

// all middlewares
const middlewares = [
  express.json(),
  express.urlencoded({extended: true}),
  cors(),
];
app.use(middlewares);

// set static path for show uploads files
app.use("/public", express.static(path.join(__dirname, "uploads")));

// auth route
app.use("/api/auth", require("./routes/auth"));

// category route
app.use("/api/category", require("./routes/category"));

// product route
app.use("/api/product", require("./routes/product"));

// cart router
app.use("/api/cart", require("./routes/cart"));

// address router
app.use("/api/address", require("./routes/address"));

// order router
app.use("/api/order", require("./routes/order"));

// test server connection
app.get("/", (req, res) => res.json({message: "ok"}));

// custom error handler
app.use(require("./middlewares/error"));
// server running
const PORT = 1000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`server is running at ${process.env.PORT || PORT}`);
  mongoose.connect(process.env.DB_URL, () => {
    console.log("database connected");
  });
});
