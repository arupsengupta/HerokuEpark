var mongoose = require('mongoose');
var PushMapSchema = new mongoose.Schema({
  user_id : String,
  token : String
});
module.exports = mongoose.model('PushMap');

mongoose.model('PushMap', PushMapSchema);
