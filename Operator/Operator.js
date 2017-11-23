var mongoose = require('mongoose');
var Location = require('../Location/Location');

var OperatorSchema = new mongoose.Schema({
	name : String,
	password: String,
	contact : String,
	address: 	String,
	parking_id : {type: String, ref: 'Location'},
	device_token : String,
	active_flag: {type: Boolean, default: true}
});

mongoose.model('Operator',OperatorSchema);
module.exports = mongoose.model('Operator');
