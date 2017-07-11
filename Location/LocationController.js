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
    lng: req.body.lng
  },
  function(err, location){
    if(err) return res.status(500).send("There was a problem adding information to the database");
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

module.exports = router;
