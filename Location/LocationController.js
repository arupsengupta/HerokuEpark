var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var date = require('date-and-time');

//router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Location = require('./Location');
var Booking = require('../Booking/Booking');
var SensorData = require('../Sensor/Sensor');

//create a new location
router.post('/', function(req, res){
  Location.create({
    name: req.body.name,
    address: req.body.address,
    location: {
      lat: req.body.lat,
      lng: req.body.lng
    },
    number_of_slot: {
      two: req.body.parking_slot_two,
      four: req.body.parking_slot_four
    },
    opening_hours : {
        start: req.body.opening_hours_start,
        end: req.body.opening_hours_end
    }
  },
  function(err, location){
    if(err) return res.status(500).send("There was a problem adding information to the database");

    // Location.findByIdAndUpdate(location._id, { $pushAll : { parking_arr : locArr } }, {new: true}, function(err, loc){
    //   if(err) return res.status(500).send("There was a problem adding information to the database");
    //   res.status(200).send(loc);
    // });
    res.status(200).send(location);
  });
});

//return all the locations in the database
router.get('/', function(req, res){
  Location.find({}, function(err, locations){
    if(err) return res.status(500).send("There was a problem finding the locations");
    res.status(200).send(locations);
  });
});

// return a location by its id
router.get('/:id', function(req, res){
  Location.findById(req.params.id, function(err, location){
    if(err) return res.status(500).send("There was a problem finding the location");
    res.status(200).send(location);
  });
});

// get available count by parking id
router.get('/availcount/:id', function(req, res){
  var now = new Date();
  var loc_start_time = date.format(now, 'HH:mm');
  var current_date = date.format(now, 'DD-MM-YYYY');

  Location.findById(req.params.id,'number_of_slot',function(err, location){
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
        res.status(200).send(availCount);
  	  });
	  });
  });
});

// get a location details by time and hours
router.get('/:id/:time/:hours', function(req, res){
  Location.findById(req.params.id, function(err, location){
    if(err) return res.status(500).send("Error occurred");
    var currentDate = new Date();
    var reqTime = parseInt(req.params.time);
    // console.log(currentDate.getDate());
    Booking.find({parking_id: location._id, active: true, date: Date.now, start_time: {$lte : reqTime}, end_time: {$gt : reqTime}},
      function(err, bookings){
        if(err) return res.status(500).send("Error getting booking");
        for(var b=0; b<bookings.length;b++){
            for(var i=0; i<location.parking_arr.length; i++){
              if(bookings[b].slot_id == location.parking_arr[i]._id){
                location.parking_arr[i].status = bookings[b].status;
              }
            }
        }
        SensorData.find({location: location._id, status: true}, function(err, sensor){
          sensor.forEach(function(sen, i){
              var ind = parseInt(sen.slot_id);
              location.parking_arr[ind].status = 'inprocess';
          });
          res.status(200).send(location);
        });
      });

  });
});

// update a location by its id
router.put('/:id', function(req, res){
  Location.findByIdAndUpdate(req.params.id, req.body, { new:true }, function(err, location){
    if(err) return res.status(500).send("Thera was a problem updating the location");
    res.status(200).send(location);
  });
});

//update location
router.put('/manage/:id', function(req, res){
  console.log(req.body);
  console.log(req.params.id);
  Location.findByIdAndUpdate(req.params.id,
    {$set: {
      'number_of_slot.two' : req.body.number_of_slot.two,
      'number_of_slot.four': req.body.number_of_slot.four,
      'opening_hours.start': req.body.opening_hours.start,
      'opening_hours.end': req.body.opening_hours.end,
      'fare.two': req.body.fare.two,
      'fare.four': req.body.fare.four}
    }, {new: true} ,function(err, location){
      if(err) return res.status(500).send(err);
      res.status(200).send(location);
    });
});

// delete location by id
router.delete('/:id', function(req, res){
	Location.findByIdAndRemove(req.params.id, function(err, location){
		if(err) return res.status(500).send("Cannot remove location");
		res.status(200).send(location);
	});
});


module.exports = router;
