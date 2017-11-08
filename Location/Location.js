var mongoose = require('mongoose');
var LocationSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    lat: Number,
    lng: Number
  },
  number_of_slot: {
    two: Number,
    four: Number
  },
  opening_hours: {
    start: Number,
    end: Number
  },
  fare: {
    two: {type:Number, default: 0},
    four: {type:Number, default: 0}
  },
  active_flag: {type: Boolean, default: true}
});

mongoose.model('Location',LocationSchema);

module.exports = mongoose.model('Location');
