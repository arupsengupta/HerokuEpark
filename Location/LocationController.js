var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var Location = require('./Location');

//create a new location
router.post('/', function(req, res){
  Location.create({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
    opening_hours : {
        start: req.body.opening_hours_start,
        end: req.body.opening_hours_end
    },
    address: req.body.address,
    hourly_price: req.body.hourly_price
  },
  function(err, location){
    if(err) return res.status(500).send("There was a problem adding information to the database");
    var locArr = [];
    for(var i=0; i<req.body.parking_slot; i++){
      var obj = {
        status: "available"
      };
      locArr.push(obj);
    }
    Location.findByIdAndUpdate(location._id, { $pushAll : { parking_slot : locArr } }, {new: true}, function(err, loc){
      res.status(200).send(loc);
    });
    // res.status(200).send(location);
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

// update a location by its id
router.put('/:id', function(req, res){
  Location.findByIdAndUpdate(req.params.id, req.body, { new:true }, function(err, location){
    if(err) return res.status(500).send("Thera was a problem updating the location");
    res.status(200).send(location);
  });
});

module.exports = router;
