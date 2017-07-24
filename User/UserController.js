var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var User = require('./User');

//create a new user
router.post('/', function(req, res){
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    vehicle_no: req.body.number,
    password: req.body.pwd
  },
  function(err, user){
    if(err) return res.status(500).send("There was a problem adding information to the database");
    res.status(200).send(user);
  });
});

//returns all the users in the database
router.get('/', function(req, res){
  User.find({}, function(err, users){
    if(err) return res.status(500).send("There was a problem finding the users");
    res.status(200).send(users);
  });
});

router.post('/login',function(req, res){
  User.find({phone: req.body.phone}, function(err, users){
    if(err) return res.status(500).send("There was a problem finfing the usre");
    console.log(users[0].password + ', '+ req.body.pwd);
    if(users[0].password === req.body.pwd){
      res.status(200).send(users[0]);
    }else{
      res.status(401).send("Unauthorized User");
    }
  });
});

//gets a single user from the database
router.get('/:id',function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err) return res.status(500).send("Thera was a problem finding the user");
    res.status(200).send(user);
  });
});

//deletes a user form the database
router.delete('/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(err, user){
    if(err) return res.status(500).send("There was a problem deleteing the user");
    res.status(200).send("User " + user.name + " was deleted");
  });
});

//updates a single user in the database
router.put('/:id', function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user){
    if(err) return res.status(500).send("There was a problem updating the user");
    res.status(200).send(user);
  });
});

module.exports = router;
