var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));

var Operator = require('./Operator');

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

// get all operator
router.get('/', function(req,res){
	Operator.find({},function(err, operators){
		if(err) return res.status(500).send('Error getting operator list');
		res.status(200).send(operators);
	});
});

// get an operator by its id
router.get('/:id',function(req, res){
	Operator.findById(req.params.id,function(err, operator){
		if(err) return res.status(500).send('Error getting operator');
		res.status(200).send(operator);
	});
});

module.exports = router;
