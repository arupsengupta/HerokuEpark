var Booking = require('../Booking/Booking');

var unbookFunc = function(){
  var date = new Date();
  var hours = date.getHours();
  console.log('Scheduler called at :', Date.now());
  Booking.update(
    {date: Date.now(), end: {$lt : hours}, active: true},
    {$set :
      {status: 'completed', active: false}
    },
    {multi: true},
    function(err, numAffected){
      if(err) return -1;
      console.log(numAffected.nModified + ' booking updated');
      return numAffected.nModified;
    });
};

module.exports = {
  func : unbookFunc,
  cronExpr : '5 * * * *'
};
