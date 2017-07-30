var mongoose = require('mongoose');

var OperatorSchema = new mongoose.Schema({
	name : String,
	contact : String,
	parking_id : String,
	pass : String,
	device_token : {type: String, default: ''}
});

mongoose.model('Operator',OperatorSchema);
module.exports = mongoose.model('Operator');
