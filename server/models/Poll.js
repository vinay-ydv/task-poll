const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema],
  voters: [String], // store voter id
}, { timestamps: true });

module.exports = mongoose.model("Poll", pollSchema);
