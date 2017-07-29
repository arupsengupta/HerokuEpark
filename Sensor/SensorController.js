var express = require('express');
var router = express.Router();

var SensorData = require('./Sensor');
var BookingData = require('../Booking/Booking')

//get a new sensor data
router.get('/pushData',function(req, res){
  SensorData.create({
    location: req.query.locid,
    slot1: req.query.slotid,
    slot2: req.query.value
  },
  function(err, sensorData){
    if(err) return res.status(500).send('error');
    return res.status(200).send('success');
  });
});

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
