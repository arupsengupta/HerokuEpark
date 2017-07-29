var express = require('express');
var router = express.Router();
var request = require('request');

var User = require('../User/User');

//send push notification to a particular user by mobile number
router.get('/:contact/:message', function(req, res){
  var message = req.params.message;
  User.find({phone: req.params.contact}, function(err, users){
    if(err) return res.status(500).send('Error getting user details');
    if(users.length == 0){
      res.status(400).send('User not found');
    }else {
      var user = users[0];

      var body = {
        "tokens" : [user.device_token],
        "profile" : "fcm",
        "notification": {
          "message" : message
        }
      };

      var options = {
        method : 'POST',
        url : 'https://api.ionic.io/push/notification',
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
      };

      request(options, function(err, response){
        if(err) throw err;
        res.status(200).send('success');
      });
    }
  });
});

module.exports = router;
