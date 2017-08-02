var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var unbookFunc = function(req, res, next){
  var date = new Date();
  var hours = date.getHours();
  Booking.update(
    {date: Date.now(), end: {$lt : hours}, active: true},
    {$set :
      {status: 'completed', active: false}
    },
    {multi: true},
    function(err, numAffected){
      if(err) return res.status(500).send("Cannot unbook");
      console.log(numAffected);
      res.status(200).send(numAffected.nModified + " booking cancelled");
    });
};


router.use(bodyParser.urlencoded({extended: true}));

var Booking = require('./Booking');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// create a new booking
router.post('/',function(req, res){
  var otp = randomInt(1000, 9999);
  var end = parseInt(req.body.start_time) + parseInt(req.body.hours);

  Booking.create({
    user_id: req.body.user_id,
    parking_id: req.body.parking_id,
    slot_id: req.body.slot_id,
    start_time: req.body.start_time,
    end_time: end,
    hours: req.body.hours,
    otp: {
      value: otp,
      matched: false
    },
    status: req.body.status,
    type: req.body.type,
    manualData: {
      name: req.body.name,
      reg_number: req.body.reg_number,
      contact: req.body.contact
    }
  },function(err, booking){
    if(err) return res.status(500).send("Cannot book");
    res.status(200).send(booking);
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
  Booking.find({date: Date.now()} , function(err, bookings){
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
router.get('/unbook', function(req, res, next){
  next();
},unbookFunc);

// get all booking
router.get('/', function(req, res){
  Booking.find({},function(err, bookings){
    if(err) return res.status(500).send("Cannot read booking details");

    res.status(200).send(bookings);
  });
});

// delete a booking by its id
router.delete('/:id', function(req, res){
  Booking.findByIdAndRemove(req.params.id, function(err, booking){
    if(err) return res.status(500).send("Cannot delete booking");
    res.status(200).send("Deleted Successfully");
  })
});

module.exports = router;
