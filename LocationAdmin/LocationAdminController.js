var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

var LocationAdmin = require('./LocationAdmin');
var LocAdminMap = require('../LocAdminMap/LocAdminMap');

//create a new location admin
router.post('/', function(req, res){
  LocationAdmin.create({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    organization_details: {
      name: req.body.vendor_name,
      reg_number: req.body.vendor_reg,
      office_address: req.body.vendor_add,
      contract_tenure: req.body.vendor_tenure,
      contract_start_date: req.body.start_date,
      contract_end_date: req.body.end_date
    }
  }, function(err, locationAdmin){
    if(err) return res.status(500).send(err);
    LocAdminMap.create({
      locid: req.body.location_id,
      adminid: locationAdmin._id
    }, function(err, data){
      if(err) return res.status(500).send(err);
      res.status(200).send("success");
    });
  });
});

//return all location admin
router.get('/', function(req, res){
  LocationAdmin.find({active_flag: true}).exec(function(err, adminList){
    if(err) return res.status(500).send("Error getting admin list");
    res.status(200).send(adminList);
  });
});

//return an admin by its id
router.get('/:id', function(req, res){
  LocationAdmin.findById({_id: req.params.id, active_flag: true}).populate('location_id').exec(function(err, admin){
    if(err) return res.status(500).send("Error getting admin");
    res.status(200).send(admin);
  });
});

//return an admin by its phone number
router.get('/con/:contact', function(req, res){
  LocationAdmin.findOne({mobile: req.params.contact, active_flag: true}).populate('location_id').exec(function(err, admin){
    if(err) return res.status(500).send("Error getting admin");
    res.status(200).send(admin);
  });
});

//return location admin map
router.get('/map/list', function(req, res){
  LocAdminMap.find({active_flag: true}).populate('locid','name -_id').populate('adminid','name -_id').exec(function(err, maplist){
    if(err) return res.status(500).send(err);
    res.status(200).send(maplist);
  });
});

//delete an admin by its id
router.put('/:id', function(req, res){
  LocationAdmin.where({_id:req.params.id}).update({$set: {active_flag: false}}).exec(function(err, admin){
    if(err) return res.status(500).send("Error removing admin");
    res.status(200).send(admin.name + " removed successfully");
  });
});

module.exports = router;
