var mongoose = require('mongoose');
var LocationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number
});

mongoose.model('Location',LocationSchema);

module.exports = mongoose.model('Location');
