var mongoose = require('mongoose');
var SensorSchema = new mongoose.Schema({
  location: String,
  slot_id: String,
  status: Boolean
});
mongoose.model('SensorData', SensorSchema);

module.exports = mongoose.model('SensorData');
