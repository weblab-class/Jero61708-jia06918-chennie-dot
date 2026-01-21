//import libraries needed for the webserver to work!

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

import { fileURLToPath } from "url";
import { createRequire } from "module";

import { populateCurrentUser, authRouter } from "./auth.js";

const require = createRequire(import.meta.url);
const validator = require("./validator.cjs");
const api = require("./api.cjs");

// socket stuff
const socketManager = require("./server-socket.cjs");

// basic checks
validator.checkSetup();

// Server configuration below
const mongoConnectionURL = process.env.MONGO_SRV;
const databaseName = "main";

// mongoose 7 warning
mongoose.set("strictQuery", false);

// connect to mongodb
mongoose
  .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// create a new express server
const app = express();
app.use(validator.checkRoutes);

// allow us to process POST requests
app.use(express.json());

// CORS
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// set up a session, which will persist login data across requests
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// this checks if the user is logged in, and populates "req.user"
app.use(populateCurrentUser);

// Google login endpoints: /api/login, /api/whoami, /api/logout
app.use("/api", authRouter);

// connect user-defined routes
app.use("/api", api);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"), (err) => {
    if (err) {
      console.log("Error sending client/dist/index.html:", err.status || 500);
      res
        .status(err.status || 500)
        .send("Error sending client/dist/index.html - have you run `npm run build`?");
    }
  });
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status).send({
    status,
    message: err.message,
  });
});

// Render provides PORT, use 3000 locally.
const port = process.env.PORT || 3000;
const server = http.Server(app);
socketManager.init(server);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
