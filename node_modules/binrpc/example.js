/**
 *
 *  Simple example:
 *  Connect to the interface process rfd on port 2001, open a rpc server and print incoming events
 *
 */

var rpc = require('./lib/binrpc.js');

// Config
var thisHost = '172.16.23.127';
var ccuHost = '172.16.23.130';


var rpcServer = rpc.createServer({host: thisHost, port: '2031'});    // Host running rpc server
var rpcClient = rpc.createClient({host: ccuHost, port: '2001'});      // CCU

rpcServer.on('system.listMethods', function (err, params, callback) {
    console.log(' <  system.listMethods');
    callback(null, ['system.listMethods', 'system.multicall', 'event', 'listDevices']);
});

rpcServer.on('listDevices', function (err, params, callback) {
    callback(null, []);
});

rpcServer.on('event', function (err, params, callback) {
    console.log(' < event', JSON.stringify(params));
    callback(null, '');
});

rpcServer.on('system.multicall', function (err, params, callback) {
    console.log(' < system.multicall', JSON.stringify(params));
    var response = [];
    params[0].forEach(function (call) {
        console.log(' <', call.methodName, JSON.stringify(call.params));
         response.push('');
    });
    callback(null, '');
});

subscribe();

/**
 * Tell the CCU that we want to receive events
 */
function subscribe() {
    console.log(' > ', 'init', ['xmlrpc_bin://' + thisHost + ':2031', 'test123']);
    rpcClient.methodCall('init', ['xmlrpc_bin://' + thisHost + ':2031', 'test123'], function (err, res) {
        console.log(err, res);
    });
}

process.on('SIGINT', function () {
    unsubscribe();
});


/**
 * Tell the CCU that we no longer want to receive events
 */
function unsubscribe() {
    console.log(' > ', 'init', ['xmlrpc_bin://' + thisHost + ':2031', '']);
    rpcClient.methodCall('init', ['xmlrpc_bin://' + thisHost + ':2031', ''], function (err, res) {
        console.log(err, res);

        process.exit(0);
    });
    setTimeout(function () {
        console.log('force quit');
        process.exit(1);
    }, 1000);
}