/* eslint capitalized-comments: 0 */

var net = require('net');
var binary = require('binary');

var binrpc = require('./protocol.js');

/**
 * @class Client
 * @param {object} options
 * @param {string} options.host the hostname or ip address to connect to
 * @param {number} options.port the port to connect to
 * @param {number} [options.reconnectTimeout=2500] wait milliseconds until trying to reconnect after the socket was closed
 * @param {number} [options.responseTimeout=5000] wait milliseconds for method call response
 * @param {number} [options.queueMaxLength=15] maximum number of methodCalls that are allowed in the queue
 */
/** @exports client */
var Client = function (options) {
    var that = this;

    this.reconnectTimeout = options.reconnectTimeout || 2500;
    this.host = options.host;
    this.port = options.port;

    /**
     * The request queue. Array elements must be objects with the properties buffer and callback
     * @type {Array}
     */
    this.queue = [];
    /**
     * Maximum queue length. If queue length is greater than this a methodCall will return error 'You are sending too fast'
     * @type {number}
     */
    this.queueMaxLength = options.queueMaxLength || 100;
    /**
     * Time in milliseconds. How long to wait for retry if a request is pending
     * @type {number}
     */
    this.queueRetryTimeout = 50;
    /**
     * Indicates if there is a request waiting for its response
     * @type {boolean}
     */
    this.pending = false;

    /**
     * Time in milliseconds. How long to wait for a method call response
     * @type {number}
     */
    this.responseTimeout = options.responseTimeout || 5000;

    /**
     * connect
     */
    this.connect = function () {
        if (that.socket && typeof that.socket.destroy === 'function') {
            that.socket.destroy();
        }
        that.socket = net.createConnection(that.port, that.host);

        that.socket.on('error', function () {
            that.connected = false;
            if (that.reconnectTimeout) {
                setTimeout(function () {
                    that.connect(true);
                }, that.reconnectTimeout);
            }
        });

        that.socket.on('end', function () {
            that.connected = false;
            if (that.reconnectTimeout) {
                setTimeout(function () {
                    that.connect(true);
                }, that.reconnectTimeout);
            }
        });

        that.socket.on('close', function () {
            that.connected = false;
            if (that.reconnectTimeout) {
                setTimeout(function () {
                    that.connect(true);
                }, that.reconnectTimeout);
            }
        });

        that.socket.on('connect', function () {
            that.connected = true;
            that.socket.setKeepAlive(true, 10000);
        });
    };

    /**
     * Push request to the queue
     * @param {buffer} buf
     * @param {function} cb
     */
    this.queuePush = function (buf, cb) {
        this.queue.push({buf: buf, callback: cb});
        this.queueShift();
    };

    /**
     *  Shift request from the queue and write it to the socket.
     */
    this.queueShift = function () {
        var timeout;
        var writeEnd = function () {
            that.pending = false;
            clearTimeout(timeout);
            that.socket.removeAllListeners('data');
            that.socket.removeAllListeners('timeout');
            that.socket.removeAllListeners('error');
        };

        if (that.queue.length > 0) {
            if (that.pending) {
                setTimeout(that.queueShift, that.queueRetryTimeout);
            } else {
                that.pending = true;

                var response = Buffer.alloc(0);
                var chunk = 0;
                var length;

                var obj = that.queue.shift();

                that.socket.on('data', function (data) {
                    if (chunk === 0) {
                        var vars = binary.parse(data)
                            .buffer('head', 3)
                            .word8('msgType')
                            .word32bu('msgSize')
                            .vars;
                        length = vars.msgSize + 8;
                        response = data;
                        if (vars.head.toString() !== 'Bin') {
                            writeEnd();
                            if (typeof obj.callback === 'function') {
                                obj.callback(new Error('malformed response'));
                            }
                            return;
                        }
                    } else {
                        response = Buffer.concat([response, data]);
                    }
                    chunk += 1;
                    if (response.length >= length) {
                        writeEnd();
                        if (typeof obj.callback === 'function') {
                            obj.callback(null, response);
                        }
                    }
                });
                that.socket.on('error', function (err) {
                    writeEnd();
                    obj.callback(err);
                });
                that.socket.on('timeout', function () {
                    writeEnd();
                    obj.callback(new Error('socket timeout'));
                });
                timeout = setTimeout(function () {
                    writeEnd();
                    obj.callback(new Error('response timeout'));
                }, that.responseTimeout);
                that.socket.write(obj.buf, function (err) {
                    if (err && typeof obj.callback === 'function') {
                        writeEnd();
                        obj.callback(err);
                    }
                });
            }
        }
    };

    /**
     * methodCall
     * @param {string} method
     * @param {Array} params
     * @param {function} callback optional - if omitted an empty string will be send as response
     */
    this.methodCall = function (method, params, callback) {
        if (this.pending && this.queue.length > this.queueMaxLength) {
            if (typeof callback === 'function') {
                callback(new Error('You are sending too fast'));
            }
        } else {
            this.queuePush(binrpc.encodeRequest(method, params), function (err, res) {
                if (typeof callback === 'function') {
                    if (!err && res) {
                        callback(null, binrpc.decodeResponse(res));
                    } else {
                        callback(err);
                    }
                }
            });
        }
    };

    this.connect();
};

module.exports = Client;
