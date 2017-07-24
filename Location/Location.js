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
  parking_slot: [{status:String}]
});

mongoose.model('Location',LocationSchema);

module.exports = mongoose.model('Location');
