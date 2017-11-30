var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var date = require('date-and-time');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Booking = require('./Booking');
var Location = require('../Location/Location');
var User = require('../User/User');
var Mail = require('../Mail/MailController').receiptFunc;
var bookOpPush = require('../Push/PushController').bookOp;

// create a new booking
router.post('/',function(req, res){
  var now = new Date();
  var loc_start_time = date.format(now, 'hh:mm A');
  var current_date = date.format(now, 'DD-MM-YYYY');

  Booking.findOne({date: current_date, parking_id: req.body.parking_id, active: true, 'manualData.reg_number': new RegExp(req.body.reg_number, 'i'), vehicle_type: req.body.wheels}).populate('parking_id').exec(function(err, booking){
    if(err) return res.status(503).send(err);
    // console.log(booking);
    if(booking){
      var start_time =  date.parse(booking.start_time, 'hh:mm A');
      var end_time =  date.parse(loc_start_time, 'hh:mm A');
      var duration = date.subtract(end_time, start_time).toMinutes();
      var hours = parseInt(duration / 60) + 1;
      var cost = 0;
      if(booking.vehicle_type === 2){
        cost = booking.parking_id.fare.two * hours;
      }else{
        cost = booking.parking_id.fare.four * hours;
      }

      Booking.findByIdAndUpdate(booking._id, {status: 'completed', end_time: loc_start_time, mins: duration, active: false, fare: cost}, {new: true}, function(err, result){
    		if(err) return res.status(500).send("Error occured while booking");
    		// console.log('Booking has been completed');
        Location.findById(req.body.parking_id,'number_of_slot',function(err, location){
          if(err) return res.status(500).send(err);
            var bookedCarCount = 0;
            var bookedBikeCount = 0;
      	  Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 4},function(err, c){
      	  	bookedCarCount = c;
            Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 2},function(err, c){
        	  	bookedBikeCount = c;
              var availCount = {
                two : location.number_of_slot.two - bookedBikeCount,
                four : location.number_of_slot.four - bookedCarCount
              };
              req.app.io.emit('count-changed',{parking_id: location._id, value: availCount});
        	  });
      	  });
        });
    		res.status(200).send(result);
    	});
    }else{
      Booking.create({
        parking_id: req.body.parking_id,
        operator_id: req.body.operator_id,
        start_time: loc_start_time,
        end_time: '',
        mins: 0,
        date: current_date,
        type: 'manual',
        vehicle_type: req.body.wheels,
        manualData: {
          reg_number: req.body.reg_number,
        },
        timestamp: Date.now()
      },function(err, newBooking){
        if(err) return res.status(500).send("Cannot book");

        Location.findById(req.body.parking_id,'number_of_slot',function(err, location){
          if(err) return res.status(500).send(err);
            var bookedCarCount = 0;
            var bookedBikeCount = 0;
      	  Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 4},function(err, c){
      	  	bookedCarCount = c;
            Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 2},function(err, c){
        	  	bookedBikeCount = c;
              var availCount = {
                two : location.number_of_slot.two - bookedBikeCount,
                four : location.number_of_slot.four - bookedCarCount
              };
              req.app.io.emit('count-changed',{parking_id: location._id, value: availCount});
        	  });
      	  });
        });

        res.status(200).send(newBooking);
      });
    }
  });


});


router.post('/end', function(req, res){
  var now = new Date();
  var loc_start_time = date.format(now, 'hh:mm A');
  var current_date = date.format(now, 'DD-MM-YYYY');

  Booking.findById(req.body.booking_id).populate('parking_id').exec(function(err, booking){
    if(err) return res.status(500).send('Error getting booking details');
    if(booking){
      var start_time =  date.parse(booking.start_time, 'hh:mm A');
      var end_time =  date.parse(loc_start_time, 'hh:mm A');
      var duration = date.subtract(end_time, start_time).toMinutes();
      var hours = parseInt(duration / 60) + 1;
      var cost = 0;
      if(booking.vehicle_type === 2){
        cost = booking.parking_id.fare.two * hours;
      }else{
        cost = booking.parking_id.fare.four * hours;
      }
      Booking.findByIdAndUpdate(req.body.booking_id,{status: 'completed', end_time: loc_start_time, mins: duration, active: false, fare: cost}, {new: true}, function(err, booking){
        if(err) return res.status(500).send("Error occured while booking");
        // console.log('Booking has been completed');
        Location.findById(booking.parking_id,'number_of_slot',function(err, location){
          if(err) return res.status(500).send(err);
            var bookedCarCount = 0;
            var bookedBikeCount = 0;
          Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 4},function(err, c){
            bookedCarCount = c;
            Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 2},function(err, c){
              bookedBikeCount = c;
              var availCount = {
                two : location.number_of_slot.two - bookedBikeCount,
                four : location.number_of_slot.four - bookedCarCount
              };
              req.app.io.emit('count-changed',{parking_id: location._id, value: availCount});
            });
          });
        });
        res.status(200).send(booking);
      });
    }else{
      res.status(404).send('Not found');
    }
  });
});

// book using QR scan
router.post('/qr/:id',function(req, res){
  var now = new Date();
  var loc_start_time = date.format(now, 'hh:mm A');
  var current_date = date.format(now, 'DD-MM-YYYY');
  Booking.findOne({date: current_date, parking_id: req.body.parking_id, active: true, user_id: req.params.id}).populate('parking_id').exec(function(err, booking){
    if(err) return res.status(500).send('Error getting booking details');
    if(booking){
      var start_time =  date.parse(booking.start_time, 'hh:mm A');
      var end_time =  date.parse(loc_start_time, 'hh:mm A');
      var duration = date.subtract(end_time, start_time).toMinutes();
      var hours = parseInt(duration / 60) + 1;
      var cost = 0;
      if(booking.vehicle_type === 2){
        cost = booking.parking_id.fare.two * hours;
      }else{
        cost = booking.parking_id.fare.four * hours;
      }

      Booking.findByIdAndUpdate(booking._id, {status: 'completed', end_time: loc_start_time, mins: duration, active: false, fare: cost}, {new: true}, function(err, result){
    		if(err) return res.status(500).send("Error occured while booking");
    		// console.log('Booking has been completed');
        Location.findById(req.body.parking_id,'number_of_slot',function(err, location){
          if(err) return res.status(500).send(err);
            var bookedCarCount = 0;
            var bookedBikeCount = 0;
      	  Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 4},function(err, c){
      	  	bookedCarCount = c;
            Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 2},function(err, c){
        	  	bookedBikeCount = c;
              var availCount = {
                two : location.number_of_slot.two - bookedBikeCount,
                four : location.number_of_slot.four - bookedCarCount
              };
              req.app.io.emit('count-changed',{parking_id: location._id, value: availCount});
        	  });
      	  });
        });
    		res.status(200).send(result);
    	});
    }else{
      User.findById(req.params.id, function(err, user){
        if(err) return res.status(500).send('Error getting user details');
        if(user){
          Booking.create({
            user_id: user._id,
            parking_id: req.body.parking_id,
            operator_id: req.body.operator_id,
            start_time: loc_start_time,
            end_time: '',
            mins: 0,
            date: current_date,
            type: 'app',
            vehicle_type: user.vehicle_type,
            manualData: {
              reg_number: user.vehicle_no,
            },
            timestamp: Date.now()
          },function(err, booking){
            if(err) return res.status(500).send("Cannot book");
            Location.findById(req.body.parking_id,'number_of_slot',function(err, location){
              if(err) return res.status(500).send(err);
                var bookedCarCount = 0;
                var bookedBikeCount = 0;
          	  Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 4},function(err, c){
          	  	bookedCarCount = c;
                Booking.count({date: current_date, parking_id: location._id ,status: 'Booked', active: true, vehicle_type: 2},function(err, c){
            	  	bookedBikeCount = c;
                  var availCount = {
                    two : location.number_of_slot.two - bookedBikeCount,
                    four : location.number_of_slot.four - bookedCarCount
                  };
                  req.app.io.emit('count-changed',{parking_id: location._id, value: availCount});
            	  });
          	  });
            });
            res.status(200).send(booking);
          });
        }else{
          res.status(403).send('User not found');
        }
      });
    }
  });
});

// create a new booking by


// cancel a booking by user
router.put('/:booking_id', function(req, res){
	Booking.findByIdAndUpdate(req.params.booking_id, {status: 'cancelled', active: false}, function(err, result){
		if(err) return res.status(500).send("Error occured while booking");
		console.log('Booking has been cancelled by user');
		res.status(200).send("success");
	});
});

// change status booking by id
router.put('/changeStatus/:booking_id', function(req, res){
  Booking.findByIdAndUpdate({_id : req.params.booking_id},{status: req.body.status, $set: {'otp.matched': true}}, {new : true}, function(err, booking){
    if(err) return res.status(500).send('Error while changing status');
    req.app.io.emit('booked',{parking_id: booking.parking_id, slot_id : booking.slot_id, start_time: booking.start_time, hours: booking.hours});
    res.status(200).send(booking);
  });
});

// get all booking of current date
router.get('/today', function(req, res){
  //console.log(Date.now().toString());
  var now = new Date();
  var current_date = date.format(now, 'DD-MM-YYYY');
  Booking.find({date: current_date, active: true}).sort({timestamp: -1}).exec(function(err, bookings){
    if(err) return res.status(500).send("Cannot read booking details");
    res.status(200).send(bookings);
  });
});

// get all booking of an user
router.get('/user/:id', function(req, res){
  Booking.find({user_id: req.params.id}).populate('parking_id').sort({'_id': -1}).exec(function(err, bookings){
    if(err) return res.status(500).send("Error getting booking details");
    res.status(200).send(bookings);
  });
});

// get all booking for a location of current date
router.get('/today/:parking_id', function(req, res){
	Booking.find({date: Date.now(), parking_id: req.params.parking_id}, function(err, bookings){
		if(err) return req.status(500).send("Cannot get booking details");
		res.status(200).send(bookings);
	});
});

//unbook all completed bookings
var Operator = require('../Operator/Operator');
var sendBulkPush = require('../Push/PushController').pushBulk;
router.get('/unbook/:hours', function(req, res){
   Operator.find({},function(err, operators){
   	operators.forEach(function(op, i){
   var hours = parseInt(req.params.hours);
   console.log(hours);
	   var slots = '';
   Booking.find({date: Date.now(), end_time: hours,parking_id: op.parking_id}).populate('parking_id','parking_arr name').exec(function(err, bookings){
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
	}
   });

	});
   });
	res.status(200).send('success');
});

// get all booking
router.get('/', function(req, res){
  Booking.find({},function(err, bookings){
    if(err) return res.status(500).send("Cannot read booking details");
    res.status(200).send(bookings);
  });
});

// send booking receipt by mail
router.get('/receipt/:booking_id', function(req, res, next){
  req.booking_id = req.params.booking_id;
  next();
},Mail);

// delete a booking by its id
router.delete('/:id', function(req, res){
  Booking.findByIdAndRemove(req.params.id, function(err, booking){
    if(err) return res.status(500).send("Cannot delete booking");
    res.status(200).send("Deleted Successfully");
  })
});

module.exports = router;
