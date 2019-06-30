const Homey = require('homey');

var logArray = [];

module.exports = {
   log: function(level, ...args) {
      log(level, args);
   },
   getLogLines: function() {
      return getLogLines();
   }
}

function log(level, args) {

   var line = args.join(' ');

   switch(level) {
      case 'error':
      case 'debug':
      case 'info':   
         Homey.app.log( line );

         if (logArray.length >= 50) {
            logArray.shift();
         }
         logArray.push(line);
         break;
   }
}

function getLogLines() {
   return logArray;
}