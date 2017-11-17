var express = require('express');
var router = express.Router();

var SensorData = require('./Sensor');
var BookingData = require('../Booking/Booking');
var Location = require('../Location/Location');
var Operator = require('../Operator/Operator');
var pushOp = require('../Push/PushController').pushOp;
var request = require('request');

//get a new sensor data
router.get('/pushData',function(req, res){
  SensorData.create({
    location: req.query.locid,
    slot_id: req.query.slotid,
    status: req.query.value
  },
  function(err, sensorData){
    if(err) return res.status(500).send('error');
    return res.status(200).send('success');
  });
});


// testing
router.get('/test',function(req,res){
	BookingData.aggregate([
		{$match : {$and :[
			{parking_id: req.query.locid},
			{slot_id:req.query.slotid},
			{date: Date.now()}
		]}}],function(err, bookings){
		if(err) return res.status(500);
		res.status(200).send(bookings);
	});
});

router.get('/update', function(req, res){

  var value = req.query.value;
  var flag = value.includes("true");
  if(flag){
    req.app.io.emit('device',{parking_id: req.query.locid, slot_id : req.query.slotid, value : true});
    res.status(200).send('Car Arrived');
  }else{
    req.app.io.emit('device',{parking_id: req.query.locid, slot_id : req.query.slotid, value: false});
    res.status(200).send('Car Left');
  }
});

// update sensor status
// router.get('/update', function(req,res,next){
// 	var value = req.query.value;
// 	// check whether value contains true
// 	var flag = value.includes("true");
// 	Location.findById(req.query.locid,function(err, location){
// 		if(location == null) return res.status(400).send("Location not found");
// 		var slot = location.parking_arr[req.query.slotid]._id;
// 		SensorData.update({location:req.query.locid, slot_id: req.query.slotid}, {status: flag}, function(err, SensorData){
// 			if(err) return res.status(500);
// 			req.slot = parseInt(req.query.slotid) + 1;
// 			req.flag = flag;
// 			console.log('PASS 1');
// 			next();
// 		});
// 		req.slotid = slot;
// 	});
// },function(req, res, next){
//   var date = new Date();
//   var time = date.getHours();
//   var end = time+1;
//
//   BookingData.find({parking_id: req.query.locid, slot_id: req.slotid, date: Date.now(), start_time: {$lte : time}, end_time: {$gte : time}, active: true},function(err, booking){
//     if(err) return res.status(500).send('Error Occurred');
// 	  console.log(booking);
//     if(booking.length == 0){
//         req.resp = 'false';
//     }else {
//         req.booking_id = booking[0]._id;
//         req.resp = booking[0].manualData.reg_number;
//     }
// 	console.log('PASS 2');
//     next();
//   });
// },function(req, res, next){
//   if(!req.flag && req.resp !== 'false'){
//     console.log('Unbook started..');
//     BookingData.findByIdAndUpdate(req.booking_id, {status: 'completed',active: false}, function(err, data){
//       if(err) return res.status(500).send('Erron unbooking');
//       var path = 'https://arupepark.herokuapp.com/booking/receipt/'+req.booking_id;
//       request({method:'GET',url:path}, function (error, response, body) {
//          if (error) throw new Error(error);
//       });
//     });
//   }
//   if(!req.flag){
//     req.resp = 'unbooked';
//   }
//   next();
// },function(req, res, next){
// 	Operator.findOne({parking_id: req.query.locid},function(err, operator){
// 		if(err) return res.status(500);
// 		req.contact = operator.contact;
// 		req.msg = req.flag ? 'A car has been arrived on slot number ' +
//               req.slot : 'A car been removed from slot number ' + req.slot;
// 		req.title = 'Car Arrived';
//     var date = new Date();
//     if(req.flag){
//       req.app.io.emit('inprocess',{parking_id: req.query.locid, slot_id : req.slotid, start_time: date.getHours(), hours: 1});
//     }else{
//       req.app.io.emit('vacant',{parking_id: req.query.locid, slot_id : req.slotid, start_time: date.getHours(), hours: 1});
//     }
// 		next();
// 	});
// }, pushOp);

// get all sensor data
router.get('/view', function(req, res){
  SensorData.find({}, function(err, data){
    if(err) return res.status(500).send('error');
    return res.status(200).send(data);
  });
});

//Validate the current slot
router.get('/validate',function(req, res){
	SensorData.find({}, function(err, data){
	    if(err) return res.status(500).send('error');
	    return res.status(200).send(data);
	  });
});

//unbook the current slot
router.get('/unbook',function(req, res){
  SensorData.create({
    location: req.query.location,
    slot1: req.query.slot1,
    slot2: req.query.slot2
  },
  function(err, sensorData){
    if(err) return res.status(500).send('error');
    return res.status(200).send('success');
  });
});

module.exports = router;
