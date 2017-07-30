var express = require('express');
var router = express.Router();
var request = require('request');

var User = require('../User/User');

//send push notification to a particular user by mobile number
router.get('/:contact/:message', function(req, res){
  var msg = req.params.message;
  User.find({phone: req.params.contact}, function(err, users){
    if(err) return res.status(500).send('Error getting user details');
    if(users.length == 0){
      res.status(400).send('User not found');
    }else {
      var user = users[0];

      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYzVjZmRhYS0zOThmLTQ2NzAtOTgxYy01N2M1ZGVlZjIyZWYifQ.EdCpDA_6w_Ty4pj-nYeHWYwgUoDW6vi3PHvOfo-pG0g";

      var options = {
        method: 'POST',
        url: 'https://api.ionic.io/push/notifications',
        headers: {
          'cache-control': 'no-cache',
          authorization: 'Bearer ' + token,
          'content-type': 'application/json'
        },
        body: {
          tokens: [ user.device_token ],
          profile: 'fcm',
          notification: { message: msg } },
          json: true
        };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          res.status(200).send('success');
        });
     }
  });
});

module.exports = router;