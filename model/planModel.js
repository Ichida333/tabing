const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  title: String,
  date: Number,
  time: Number,
  location: String,
  cost: Number,
  
});

const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
