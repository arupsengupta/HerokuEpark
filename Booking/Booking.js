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
  end_time : String,
  mins : Number,
  active: {type: Boolean, default: true},
  date: {type: String},
  status: {type: String, default: 'Booked'},
  type: {type: String, default: 'manual'},
  vehicle_type: Number,
  manualData : {
    reg_number : String,
  },
  timestamp: {type: Number, default: Date.now()}
});

mongoose.model('Booking', BookingSchema);

module.exports = mongoose.model('Booking');
