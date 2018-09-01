var rpc = require('./../lib/binrpc.js');

require('should');

describe('client server connection', function () {
    var rpcServer;
    var rpcClient;
    it('should raise an error if no connection can be established', function (done) {
        this.timeout(60000);
        var rpcClientNC = rpc.createClient({host: 'localhost', port: '2032'});
        rpcClientNC.methodCall('testNC', [1, 1.1, 'string', true, [1, 2, 3], {a: 'a', b: 'b'}], function (err, res) {
            if (err) {
                done()
            } else {
                done(new Error('no Error was thrown'));
            }
        });
    });
    it('should open a server without throwing an error', function () {
        rpcServer = rpc.createServer({host: '127.0.0.1', port: '2037'});
    });
    it('should create a client without error', function () {
        rpcClient = rpc.createClient({host: '127.0.0.1', port: '2037'});
    });
    it('should do nothing when shifting an empty queue', function () {
        rpcClient.queueShift();
    });
    it('should send a call to the server and receive empty string', function (done) {
        this.timeout(30000);
        rpcServer.on('test1', function (err, params, callback) {
            callback(null, '');
        });
        rpcClient.methodCall('test1', [''], function (err, res) {
            if (err) {
                done(err);
            } else if (res !== '') {
                done(new Error('received wrong response ' + res));
            } else {
                done();
            }
        });
    });
    it('should send a call with some params to the server and receive some params', function (done) {
        this.timeout(30000);
        rpcServer.on('test2', function (err, params, callback) {
            params.should.deepEqual([1, 1.1, 'string', true, [1, 2, 3], {a: 'a', b: 'b'}]);
            callback(null, [2, 2.2, 'string2', true, [3, 4, 5], {c: 'c', d: 'd'}]);
        });
        rpcClient.methodCall('test2', [1, 1.1, 'string', true, [1, 2, 3], {a: 'a', b: 'b'}], function (err, res) {
            if (err ) {
                done(err);
            } else {
                res.should.deepEqual([2, 2.2, 'string2', true, [3, 4, 5], {c: 'c', d: 'd'}]);
                done();
            }
        });
    });
    it('should send a unknown call with some params to the server and trigger a NotFound event', function (done) {
        this.timeout(30000);
        rpcServer.on('NotFound', function (method, params) {
            method.should.equal('test3');
            params.should.deepEqual([1, 1.1, 'string', true, [1, 2, 3], {a: 'a', b: 'b'}]);
            done();
        });
        rpcClient.methodCall('test3', [1, 1.1, 'string', true, [1, 2, 3], {a: 'a', b: 'b'}], function (err, res) {
            if (err) {
                done(err);
            }
        });
    });

    it('should fill up the queue', function (done) {
        this.timeout(60000);
        rpcServer.on('slow', function (err, params, callback) {
            setTimeout(function () {
                callback(null, '');
            }, 2000);
        });
        for (var i = 0; i < 110; i++) {
            rpcClient.methodCall('slow', [''], function (err, res) {});
        }
        rpcClient.methodCall('slow', [''], function (err, res) {
            err.toString().should.equal('Error: You are sending too fast');
            done(!err);
        });
    });

    it('should create a client twice without error', function () {
        var rpcClientTwice = rpc.createClient({host: 'localhost', port: '2033'});
        rpcClientTwice = rpc.createClient({host: 'localhost', port: '2033'});
    });

});


