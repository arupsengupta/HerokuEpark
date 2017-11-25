var mongoose = require('mongoose');
//var DateOnly = require('mongoose-dateonly')(mongoose);
var Location = require("../Location/Location");
var Operator = require('../Operator/Operator');
var User = require("../User/User");

var BookingSchema = new mongoose.Schema({
  user_id : {type: String, ref: 'User'},
  parking_id : {type:String, ref:'Location'},
  operator_id : {type: String, ref:'Operator'},
  start_time : String,
  mins : Number,
  end_time : String,
  active: {type: Boolean, default: true},
  date: {type: Date, default: new Date()},
  status: {type: String, default: 'Booked'},
  type: {type: String, default: 'manual'},
  manualData : {
    reg_number : String,
  }
});

mongoose.model('Booking', BookingSchema);

module.exports = mongoose.model('Booking');
