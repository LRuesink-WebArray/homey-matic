/* eslint capitalized-comments: 0 */

var util = require('util');
var net = require('net');
var EventEmitter = require('events').EventEmitter;
var binary = require('binary');

var binrpc = require('./protocol.js');

/**
 * @class Server
 * @param {object} options
 * @param {string} options.host ip address on which the server should listen
 * @param {number} options.port port on which the server should listen
 */
/** @exports server */
var Server = function (options) {
    var that = this;
    this.host = options.host;
    this.port = options.port;
    this.server = net.createServer(function (client) {
        var receiver = Buffer.alloc(0);
        var chunk = 0;
        var length;

        client.on('error', function () {
            // console.log('error  ' + JSON.stringify(e));
        });

        client.on('end', function () {
            // console.log('<--  disconnected');
        });

        client.on('data', function (data) {
            if (chunk === 0) {
                // request header
                var vars = binary.parse(data)
                    .buffer('head', 3)
                    .word8('msgType')
                    .word32bu('msgSize')
                    .vars;
                length = vars.msgSize;
                receiver = data;
            } else {
                // append request data
                receiver = Buffer.concat([receiver, data]);
            }

            chunk += 1;

            if (receiver.length >= (length + 8)) {
                // request complete
                var request = binrpc.decodeRequest(receiver);

                receiver = Buffer.alloc(0);
                chunk = 0;

                that.handleCall(request, client);
            }
        });
    });

    this.server.listen(this.port, this.host, function () {
        // console.log('listening on ' + that.port);
    });

    this.handleCall = function (request, client) {
        var method = request.method;
        var params = request.params;

        /**
         * Fires when RPC method call is received
         *
         * @event Server#[method]
         * @param {*} error
         * @param {array} params
         * @param {function} callback callback awaits params err and response
         */
        var res = that.emit(method, null, params, function (err, response) {
            var buf = response ? binrpc.encodeResponse(response) : binrpc.encodeResponse('');
            client.write(buf);
        });

        if (!res) {
            /**
             * Fires if a RPC method call has no event handler.
             * RPC response is always an empty string.
             *
             * @event Server#NotFound
             * @param {string} method
             * @param {array} params
             */
            that.emit('NotFound', method, params);
            client.write('');
        }
    };
};

util.inherits(Server, EventEmitter);

module.exports = Server;
