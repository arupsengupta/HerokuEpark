var mongoose = require('mongoose');
var LocationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  opening_hours: {
    start: Number,
    end: Number
  },
  address: String,
  hourly_price: Number,
  parking_arr: [{status:String}],
  number_of_slot: Number,
  booked_slot: Number
});

mongoose.model('Location',LocationSchema);

module.exports = mongoose.model('Location');
