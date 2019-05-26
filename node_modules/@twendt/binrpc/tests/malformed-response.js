var rpc = require('./../lib/binrpc.js');
var net = require('net');

require('should');

describe('malformed response', function () {
    it('should return an error', function (done) {
        var server = net.createServer(function (socket) {
            socket.on('data', function () {
                socket.write('Echo server\r\n');
            });
        });
        server.listen(2042, '127.0.0.1');

        var rpcClient = rpc.createClient({host: '127.0.0.1', port: 2042});
        rpcClient.methodCall('test', [''], function (err, res) {
            err.toString().should.equal('Error: malformed response');
            done(err ? undefined : new Error(''));
        });
    });
});
