var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var PushMap = require('./PushMap');

// enter a new map
router.post('/', function(req, res){
  PushMap.create({
    user_id : req.body.user_id,
    token : req.body.token
  },
  function(err, pushMap){
    if(err) return res.status(500).send("Error saving data");
    res.send(200).send(pushMap);
  })
});
