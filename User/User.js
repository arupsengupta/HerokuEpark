var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  vehicle_no: String,
  password: String,
  device_token: {type: String, default: ''}
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
