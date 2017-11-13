var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var Location = require('../Location/Location');

function decrypt(text){
  if (text === null || typeof text === 'undefined') {return text;};
  var decipher = crypto.createDecipher('aes-256-cbc', process.env.SERVER_SECRET);
  console.log(text);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc', process.env.SERVER_SECRET);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

var LocationAdminSchema = new mongoose.Schema({
  name: String,
  password: {type: String, get: decrypt, set: encrypt},
  mobile: Number,
  // email: {type: String, get: decrypt, set: encrypt},
  email: {type: String},
  device_id: String,
  last_login: String,
  last_ip: String,
  organization_details: {
    name: String,
    reg_number: String,
    office_address: String,
    contract_tenure: Number,
    contract_start_date: Date,
    contract_end_date: Date
  },
  active_flag: {type: Boolean, default: true}
});

LocationAdminSchema.set('toObject', { getters: true });
LocationAdminSchema.set('toJSON', { getters: true });

mongoose.model('LocationAdmin', LocationAdminSchema);
module.exports = mongoose.model('LocationAdmin');
