var Booking = require('../Booking/Booking');

var unbookFunc = function(){
  var date = new Date();
  var hours = date.getHours();
  console.log('Scheduler called at :', Date.now());
  Booking.update(
    {date:Date.now(), end_time: {$lt : hours}, active: true},
    {status: 'completed', active: false},
    {multi: true},
    function(err, numAffected){
      if(err) return -1;
      console.log(numAffected.nModified + ' booking updated');
      return numAffected.nModified;
    });
};

var expireCheck = function(){
	var date = new Date();
	var hours = date.getHours();
  	console.log('Scheduler called at :', Date.now());
	Booking.find({date:Date.now(), end_time: hours, active: true}, function(err, bookings){
		if(err) return res.status(500).send("Error finding bookings");
		if(bookings.length !== 0){
			
		}
	});
	
};

module.exports = {
  func : unbookFunc,
  cronExpr : '5 * * * *'
};
