/* eslint capitalized-comments: 0 */

var Client = require('./client.js');
var Server = require('./server.js');

/** @exports binrpc */
var Binrpc = {

    /**
     * RPC client factory
     * @param {object} options
     * @param {string} options.host the hostname or ip address to connect to
     * @param {number} options.port the port to connect to
     * @param {number} [options.reconnectTimeout=2500] wait milliseconds until trying to reconnect after the socket was closed
     * @param {number} [options.responseTimeout=5000] wait milliseconds for method call response
     * @param {number} [options.queueMaxLength=15] maximum number of methodCalls that are allowed in the queue
     * @returns {Client}
     */
    createClient: function (options) {
        return new Client(options);
    },

    /**
     * RPC server factory
     * @param {object} options
     * @param {string} options.host ip address on which the server should listen
     * @param {number} options.port port on which the server should listen
     * @returns {Server}
     */
    createServer: function (options) {
        return new Server(options);
    }
};

module.exports = Binrpc;
