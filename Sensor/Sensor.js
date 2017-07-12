var mongoose = require('mongoose');
var SensorSchema = new mongoose.Schema({
  location: String,
  slot1: String,
  slot2: String
});
mongoose.model('SensorData', SensorSchema);

module.exports = mongoose.model('SensorData');
