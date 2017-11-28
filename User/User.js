var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  vehicle_no: String,
  vehicle_type: {type: Number, default: 4},
  password: String,
  device_token: {type: String, default: ''}
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
