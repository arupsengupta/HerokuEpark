var Booking = require('../Booking/Booking');
var Operator = require('../Operator/Operator');
var sendBulkPush = require('../Push/PushController').pushBulk;
var request = require('request');

var unbookFunc = function(){
  var date = new Date();
  var hours = date.getHours();
  //console.log(hours);
  console.log('Scheduler called at :', Date.now());
  Booking.update(
    {date:Date.now(),end_time: hours, active: true},
    {status: 'completed', active: false},
    {multi: true},
    function(err, numAffected){
      if(err) return -1;
      console.log(numAffected.nModified + ' booking updated');
      //return numAffected.nModified;
	//console.log(bookings);
	Booking.find({date:Date.now(), end_time:hours,status:'completed'},function(err, bookings){
		bookings.forEach(function(book, ind){
		var path = 'https://arupepark.herokuapp.com/booking/receipt/'+book._id;
        	request({method:'GET',url:path}, function (error, response, body) {
         	 if (error) throw new Error(error);
          	return 0;
        	});
	   });
	});
    });
};

var expireCheck = function(){
	var date = new Date();
	var hours = date.getHours() + 1;
  	console.log('Scheduler called at :', Date.now());
	Booking.find({date:Date.now(), end_time: hours, active: true, type: {$ne : 'manual'}}).populate({path:'user_id', select: 'device_token'}).exec(function(err, bookings){
		if(err) return res.status(500).send("Error finding bookings");

		if(bookings.length !== 0){
      var msg = 'Your booking is about to end, please reach the parking place soon';
			for(var i=0;i<bookings.length;i++){
          var token_arr = [];
          token_arr.push(bookings[i].user_id.device_token);
          sendBulkPush(token_arr, msg,'user');
			   //token_arr.push(bookings[0].user_id.device_token);
			}
			console.log('Bulk push to users successful');
			// if(token_arr.length !== 0){
			//    sendBulkPush(token_arr, msg,'user');
			//    console.log('Bulk push to users successful');
			// }
		}
	});
   Operator.find({},function(err, operators){
   	operators.forEach(function(op, i){
   //var hours = parseInt(req.params.hours);
   //console.log(hours);
	   var slots = '';
   Booking.find({date: Date.now(), end_time: hours,parking_id: op.parking_id,active:true}).populate('parking_id','parking_arr name').exec(function(err, bookings){
   	if(err) return res.status(500).send("Error ");
	//res.status(200).send(bookings);
	bookings.forEach(function(item,index){
	   var parking_arr = item.parking_id.parking_arr;
	   parking_arr.forEach(function(park,j){
	   	if(item.slot_id == park._id){
			slots += 'P'+j+' ';
			//break;
		}
	   });
	});
	if(bookings.length !== 0){
	   var msg = 'These slots are getting deallocated this hour : ' + slots;
	   var token_arr = [];
	   token_arr.push(op.device_token);
	   sendBulkPush(token_arr,msg,'op');
	   console.log('Bulk push to operator successful');
	}
   });

	});
   });
//	Booking.find({date: Date.now(), end_time: hours}).populate('parking_id', 'parking_arr'});
};

module.exports = {
  func : unbookFunc,
  expireFunc : expireCheck,
  cronExprUnbook : '5 * * * *',
  cronExprExpire : '30 * * * *',
};
