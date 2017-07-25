var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var Location = require('./Location');
var Booking = require('../Booking/Booking');

//create a new location
router.post('/', function(req, res){
  var locArr = [];
  for(var i=0; i<req.body.parking_slot; i++){
    var obj = {
      status: "available"
    };
    locArr.push(obj);
  }

  Location.create({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    opening_hours : {
        start: req.body.opening_hours_start,
        end: req.body.opening_hours_end
    },
    address: req.body.address,
    hourly_price: req.body.hourly_price,
    parking_arr: locArr,
    number_of_slot: req.body.parking_slot,
    booked_slot: 0
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

// get a location details by time and hours
router.get('/:id/:time/:hours', function(req, res){
  Location.findById(req.params.id, function(err, location){
    if(err) return res.status(500).send("Error occurred");
    Booking.find({parking_id: location._id, active: true},
      function(err, bookings){
        if(err) return res.status(500).send("Error getting booking");
        for(var b=0; b<bookings.length;b++){
          var reqTime = parseInt(req.params.time);
          var reqHours = parseInt(req.params.hours);
          if((reqTime >= bookings[b].start_time && reqTime < bookings[b].start_time + bookings[b].hours)
              || (reqTime < bookings[b].start_time && (reqTime + reqHours) > bookings[b].start_time)){
                // console.log(reqTime + reqHours);
            for(var i=0; i<location.parking_arr.length; i++){
              if(bookings[b].slot_id == location.parking_arr[i]._id){
                location.parking_arr[i].status = "booked";
              }
            }
          }
        }
        res.status(200).send(location);
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

module.exports = router;
