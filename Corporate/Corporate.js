var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Location = require('../Location/Location');

var CorporateSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: {
    name: String,
    number: Number,
    email: String
  },
  location_id: {type: Schema.Types.ObjectId, ref: 'Location'},
  active_flag: {type:Boolean, default: true}
});

mongoose.model('Corporate', CorporateSchema);
module.exports = mongoose.model('Corporate');
