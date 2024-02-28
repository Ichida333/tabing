const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
},
  description: String,
  date:  String,
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
    

  
});

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
