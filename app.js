const express = require("express");
require("dotenv").config();
const app = express();
const router = require("./src/routes/api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Security Middleware Imports
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const cors = require("cors");

// Database Library Import
const mongoose = require("mongoose");

// Security Middleware Implementation
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://laramintkw.com",
        "https://lara-mint-ecommerce-app.vercel.app",
      ];
      const regex = /\.laramintkw\.com$/;

      if (allowedOrigins.indexOf(origin) !== -1 || regex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Handle Preflight Requests
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  next();
});

// Request Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// Body Parser and Cookie Parser Implementation
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Database Connection
let URI = process.env.DATABASE_URL;
let option = {
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
};

mongoose.connect(URI, option, (e) => {
  if (e) {
    console.error("Database Connection Error:", e);
  } else {
    console.log("Database Connection Success");
  }
});

// Routing Implementation
app.use("/", router);

// Undefined Route Handling
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;
