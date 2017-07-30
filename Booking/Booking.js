var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);
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
  date: {type: DateOnly, default: Date.now},
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
