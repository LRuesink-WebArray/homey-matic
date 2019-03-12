/*global module:true, require:false*/

const EventEmitter = require('events');

class InterfaceConnection extends EventEmitter {
    constructor(interfaceName, config) {
        super();
        this.interfaceName = interfaceName;
        this._settings = config;
        this._settings.initUrl = config.protocol + "://" + config.homeyIP + ":" + config.serverPort;

        this.createRpcServer();
        this.rpcClient = this.createRpcClient();
        this.initInterface();
    }

    createRpcServer() {
        var self = this
        this.rpcServer = this._settings.rpc.createServer({ host: this._settings.homeyIP, port: this._settings.serverPort });

        this.rpcServer.on('system.listMethods', function (err, params, callback) {
            callback(null, ['system.listMethods', 'system.multicall', 'event', 'listDevices']);
        });

        this.rpcServer.on('listDevices', function (err, params, callback) {
            callback(null, []);
        });

        this.rpcServer.on('event', function (err, params, callback) {
            self.emitEvent(params)
            callback(null, '');
        });

        this.rpcServer.on('system.multicall', function (err, params, callback) {
            params[0].forEach(function (call) {
                if (call.methodName === 'event') {
                    self.emitEvent(call.params)
                }
            });
            callback(null, '');
        });

    }

    createRpcClient() {
        return this._settings.rpc.createClient({ host: this._settings.ccuIP, port: this._settings.port });
    }

    emitEvent(event) {
        if (event && event.length === 4) {
            let eventName = "event-" + this.interfaceName + "-" + event[1] + "-" + event[2]
            this.emit('event', {
                'interfaceName': this.interfaceName,
                'name': eventName,
                'value': event[3]
            })
        }
        this.lastEvent = now();
    }

    /**
     * Tell the CCU that we want to receive events
     */
    initInterface() {
        var self = this;
        this.rpcClient.methodCall('init', [this._settings.initUrl, 'homey_' + this.interfaceName], function (err, res) {
            if (err) {
                console.log("Failed to connect:", self.interfaceName)
                setTimeout(() => {
                    self.initInterface();
                }, 10 * 1000);
            } else {
                console.log("Connected to", self.interfaceName)
                self.lastEvent = now();
                self.checkConnection();
            }
        });
    }

    checkConnection() {
        clearTimeout(this.rpcPingTimer);
        const pingTimeout = this._settings.pingTimeout;
        const elapsed = Math.round((now() - this.lastEvent) / 1000);
        if (elapsed > pingTimeout) {
            console.log('ping timeout', this.interfaceName, elapsed);
            this.initInterface();
            return;
        }
        if (elapsed >= (pingTimeout / 2)) {
            this.rpcClient.methodCall('ping', ['homey'], (err, res) => {

            });
        }
        this.rpcPingTimer = setTimeout(() => {
            this.checkConnection();
        }, pingTimeout * 250);
    }

    /**
     * Tell the CCU that we no longer want to receive events
     */
    unsubscribe() {
        this.rpcClient.methodCall('init', [this._settings.initUrl, ''], function (err, res) {
        });
    }

    listDevices() {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.rpcClient.methodCall('listDevices', [], function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    let devices = []
                    for (var i = 0; i < res.length; i++) {
                        res[i].HomeyInterfaceName = self.interfaceName
                        devices.push(res[i])
                    }
                    resolve({ 'interfaceName': self.interfaceName, 'devices': devices })
                }
            });
        })
    }

    getValue(address, key) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.rpcClient.methodCall('getValue', [address, key], function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    setValue(address, key, value) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.rpcClient.methodCall('setValue', [address, key, value], function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

function now() {
    return (new Date()).getTime();
}

module.exports = InterfaceConnection;