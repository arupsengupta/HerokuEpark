var mongoose = require('mongoose');
//var DateOnly = require('mongoose-dateonly')(mongoose);
var Location = require("../Location/Location");
var User = require("../User/User");

var BookingSchema = new mongoose.Schema({
  user_id : {type: String, ref: 'User'},
  parking_id : {type:String, ref:'Location'},
  slot_id : String,
  start_time : Number,
  hours : Number,
  end_time : Number,
  extra_mins : {type: Number, default: 0},
  active: {type: Boolean, default: true},
  otp: {
    value : Number,
    matched : {type: Boolean, default: false}
  },
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'pending'},
  type: {type: String, default: 'app'},
  manualData : {
    name: String,
    reg_number : String,
    contact: String
  }
});

mongoose.model('Booking', BookingSchema);

module.exports = mongoose.model('Booking');
