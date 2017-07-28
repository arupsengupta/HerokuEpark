var mongoose = require('mongoose');
var BookingSchema = new mongoose.Schema({
  user_id : String,
  parking_id : String,
  slot_id : String,
  start_time : Number,
  hours : Number,
  extra_mins : {type: Number, default: 0},
  active: {type: Boolean, default: true},
  otp: {
    value : Number,
    matched : {type: Boolean, default: false}
  },
	date: {type: Date, default:new Date()},
  status: String
});

mongoose.model('Booking', BookingSchema);

module.exports = mongoose.model('Booking');
