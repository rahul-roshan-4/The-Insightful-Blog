// config/middleware.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

module.exports = function(app) {
  // Serve static files from the 'build' directory
  app.use(express.static(path.join(__dirname, "../build")));

  // Setup CORS
  const allowedOrigins = [
    "http://localhost:3000",
    "https://the-insightful-blog.onrender.com",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      methods: "GET,PUT,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  // Middleware for parsing JSON and cookies
  app.use(express.json());
  app.use(cookieParser());

  // Serve static files from the 'uploads' directory
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
};
