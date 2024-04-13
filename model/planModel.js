const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  location: String,
  description: String,
  cost: String,
  images: [String],
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
}
  
});

const Plan = mongoose.model("Plan", PlanSchema);
module.exports = Plan;
