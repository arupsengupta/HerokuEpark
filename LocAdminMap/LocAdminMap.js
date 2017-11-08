var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Location = require('../Location/Location');
var LocationAdmin = require('../LocationAdmin/LocationAdmin');

var LocAdminMapSchema = new mongoose.Schema({
  locid: {type: Schema.Types.ObjectId, ref: 'Location'},
  adminid: {type: Schema.Types.ObjectId, ref: 'LocationAdmin'},
  active_flag: {type: Boolean, default: true}
});

mongoose.model('LocAdminMapSchema', LocAdminMapSchema);
module.exports = mongoose.model('LocAdminMapSchema');
