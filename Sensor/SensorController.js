var express = require('express');
var router = express.Router();

var SensorData = require('./Sensor');

//get a new sensor data
router.get('/',function(req, res){
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

router.get('/view', function(req, res){
  SensorData.find({}, function(err, data){
    if(err) return res.status(500).send('error');
    return res.status(200).send(data);
  });
});




module.exports = router;
