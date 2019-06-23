
const Homey = require('homey');

module.exports = [
{
   description:	'Show loglines',
   method:      'GET',
   path:        '/log/getloglines/',
   requires_authorization: true,
   role: 'owner',
   fn: function(args, callback) {
      var result = Homey.app.getLogLines(args);
      callback(null, result);
   }

}]