const Homey = require('homey');

module.exports = [
    {
        description: 'Show loglines',
        method: 'GET',
        path: '/log/getloglines/',
        requires_authorization: true,
        role: 'owner',
        fn: function (args, callback) {
            var result = Homey.app.getLogLines(args);
            callback(null, result);
        }
    },
    {
        description: 'Stored Bridges',
        method: 'GET',
        path: '/bridges/get/',
        requires_authorization: true,
        role: 'owner',
        fn: function (args, callback) {
            var bridges = Homey.app.getStoredBridges();
            var result = [];
            Object.keys(bridges).forEach((serial) => {
               result.push('Serial: ' + serial + ' IP: ' + bridges[serial].address)
            })
            callback(null, result);
        }
    },
    {
        description: 'Delete Stored Bridges',
        method: 'GET',
        path: '/bridges/delete/',
        requires_authorization: true,
        role: 'owner',
        fn: function (args, callback) {
            var bridges = Homey.app.deleteStoredBridges();
            var result = true;
            callback(null, result);
        }
    }

]
