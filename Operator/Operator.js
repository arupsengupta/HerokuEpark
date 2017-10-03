var mongoose = require('mongoose');

var OperatorSchema = new mongoose.Schema({
	name : String,
	password: String,
	contact : String,
	address: 	String,
	parking_id : String,
	device_token : String,
	active_flag: {type: Boolean, default: true}
});

mongoose.model('Operator',OperatorSchema);
module.exports = mongoose.model('Operator');
