var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

var Operator = require('./Operator');
var bookMessageOp = require('../Push/PushController').bookOp;

// create an operator
router.post('/', function(req, res){
	Operator.create({
		name : req.body.name,
		contact : req.body.contact,
		address: 	req.body.address,
		parking_id : req.body.parking_id
	},function(err, operator){
		if(err) return res.status(500).send('Error saving details');
		res.status(200).send(operator);
	});
});

// operator login
router.post('/login',function(req,res){
	Operator.find({contact: req.body.contact, pass: req.body.pwd}, function(err, operator){
		if(err) return res.status(500).send('Error occurred');
		res.status(200).send(operator);
	});
});

// get all operator
router.get('/', function(req,res){
	Operator.find({active_flag: true},function(err, operators){
		if(err) return res.status(500).send('Error getting operator list');
		res.status(200).send(operators);
	});
});

// get all operator of a locaton
router.get('/loc/:id', function(req,res){
	Operator.find({parking_id: req.params.id, active_flag: true},function(err, operators){
		if(err) return res.status(500).send('Error getting operator list');
		res.status(200).send(operators);
	});
});

// send notification to operator
router.post('/notify', function(req, res, next){
	//Operator.findOne({parking_id: req.body.parking_id}, function(err, operator){
		//if(err) return res.status(500).send('Error getting parking operator');
		//if(operator != null){
			req.msg = '<strong>New Booking : ' + req.body.reg_number + '</strong><br>From: ' + req.body.start + '' + req.body.ampm + ', hours: ' + req.body.hours;
			req.parking_id = req.body.parking_id;
			//req.device_token = operator.device_token;
		// }else {
		// 	return res.status(400).status("Operator not found");
		// }
		next();
	//});
}, bookMessageOp);

// get an operator by its id
router.get('/:id',function(req, res){
	Operator.findById(req.params.id,function(err, operator){
		if(err) return res.status(500).send('Error getting operator');
		res.status(200).send(operator);
	});
});

// get an operator by its phone number
router.get('/con/:number',function(req, res){
	Operator.findOne({contact: req.params.number}).populate('parking_id').exec(function(err, operator){
		if(err) return res.status(500).send('Error getting operator');
		res.status(200).send(operator);
	});
});

// insert device token for push notification (Operator App)
router.get('/token/:phone/:token', function(req, res){
	Operator.update({contact: req.params.phone}, {device_token: req.params.token}, function(err, resp){
    if(err) return res.status(500).send('Error saving device token');
    res.status(200).send('Success');
  });
});

// mark inactive an opeartor
router.put('/', function(req,res){
	Operator.update({'_id' : {$in : req.body.id}},{$set: {active_flag: false}},{multi: true}).exec(function(err, result){
		if(err) return res.status(500).send("Error updating opeartor");
		res.status(200).send('success');
	});
});

//update operator by its id
router.put('/:id', function(req, res){
	Operator.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, operator){
		if(err) return res.status(500).send("Error updating operator");
		res.status(200).send(operator);
	});
});

// remove an operator
router.delete('/:id', function(req, res){
	Operator.findByIdAndRemove(req.params.id, function(err, operator){
		if(err) return res.status(500).send("Cannot remove operator");
		res.status(200).send("Operator " + operator.name + " removed successfully");
	});
});

module.exports = router;
