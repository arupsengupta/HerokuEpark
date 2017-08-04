var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));

var Operator = require('./Operator');
var bookMessageOp = require('../Push/PushController').bookOp;

// create an operator
router.post('/', function(req, res){
	Operator.create({
		name: req.body.name,
		contact: req.body.contact,
		parking_id: req.body.parking_id,
		pass: req.body.pwd
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
	Operator.find({},function(err, operators){
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

// insert device token for push notification (Operator App)
router.get('/token/:phone/:token', function(req, res){
	Operator.update({contact: req.params.phone}, {device_token: req.params.token}, function(err, resp){
    if(err) return res.status(500).send('Error saving device token');
    res.status(200).send('Success');
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
