var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var Booking = require('./Booking');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// create a new booking
router.post('/',function(req, res){
  var otp = randomInt(1000, 9999);

  Booking.create({
    user_id: req.body.user_id,
    parking_id: req.body.parking_id,
    slot_id: req.body.slot_id,
    start_time: req.body.start_time,
    hours: req.body.hours,
    active: true,
    otp: {
      value: otp,
      matched: false
    },
    status: 'pending'
  },function(err, booking){
    if(err) return res.status(500).send("Cannot book");
    res.status(200).send(booking);
  });
});

// change status booking by id
router.put('/changeStatus/:booking_id', function(req, res){
  Booking.update({_id : req.params.booking_id},{status: req.body.status, $set: {'otp.matched': true}}, function(err, booking){
    if(err) return res.status(500).send('Error while changing status');
    res.status(200).send(booking);
  });
});

// get all booking of current date
router.get('/today', function(req, res){
  //console.log(Date.now().toString());
  Booking.find({date: Date.now()} , function(err, bookings){
    if(err) return res.status(500).send("Cannot read booking details");
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

// get all booking
router.get('/', function(req, res){
  Booking.find({},function(err, bookings){
    if(err) return res.status(500).send("Cannot read booking details");
    res.status(200).send(bookings);
  });
});

module.exports = router;
