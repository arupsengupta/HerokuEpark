var mongoose = require('mongoose');

var OperatorSchema = mongoose.Schema({
	name : String,
	contact : String,
	parking_id : String,
	password : String
});

mongoose.model('Operator',OperatorSchema);
module.exports = mongoose.model('Operator');
