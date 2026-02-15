require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pollRoutes = require("./routes/pollRoutes.js");
const voter = require("./middleware/voter.js");
const socket = require("./socket.js");

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: "https://task-poll-frontend.onrender.com", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(voter);

app.use("/api/polls", pollRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"));

const server = app.listen(5000, () =>
  console.log("Server running")
);

socket.init(server);
