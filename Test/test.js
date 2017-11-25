let date = require('date-and-time');
let now = new Date();
console.log(date.format(now, 'HH:mm'));
console.log(date.format(now, 'YYYY/MM/DD HH:mm:ss'));
var date1 =  date.parse('01:45', 'HH:mm');
var date2 =  date.parse('12:45', 'HH:mm');
console.log(date.subtract(date2, date1).toMinutes());
