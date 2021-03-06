var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

var Corporate = require('./Corporate');

//create a new corporate user
router.post('/', function(req, res){
  Corporate.create({
    name: req.body.name,
    address: req.body.address,
    contact: {
      name: req.body.contact.name,
      number: req.body.contact.number,
      email: req.body.contact.email
    },
    location_id: req.body.parking_id
  },function(err, corporate){
    if(err) return res.status(500).send("Error saving details");
    res.status(200).send(corporate);
  });
});

//get all corporate users list
router.get('/', function(req, res){
  Corporate.find({active_flag: true}, function(err, corporateList){
    if(err) return res.status(500).send("Error getting corporate list");
    res.status(200).send(corporateList);
  });
});

//get all corporate users list of a location
router.get('/loc/:id', function(req, res){
  Corporate.find({location_id:req.params.id, active_flag: true}, function(err, corporateList){
    if(err) return res.status(500).send("Error getting corporate list");
    res.status(200).send(corporateList);
  });
});

router.get('/:id', function(req, res){
  Corporate.findById(req.params.id, function(err, corporate){
    if(err) return res.status(500).send("Error getting corporate details");
    res.status(200).send(corporate);
  });
});

//delete a corporate user by id
router.put('/:id', function(req, res){
  Corporate.update({_id: req.params.id},{$set: {active_flag: false}}).exec(function(err, corporate){
    if(err) return res.status(500).send("Error updating corporate user");
    res.status(200).send(corporate.name + " removed successfully");
  });
});

module.exports = router;
