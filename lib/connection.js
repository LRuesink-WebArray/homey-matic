/*global module:true, require:false*/

const EventEmitter = require('events');
const freeport = require('freeport');

const used_keys = [
    "ACTIVE_PROFILE",
"ACTIVITY_STATE",
"ACTUAL_TEMPERATURE",
"ALARMSTATE",
"BOOST_MODE",
"BOOST_STATE",
"BRIGHTNESS",
"CONTROL_MODE",
"CURRENT",
"DIRECTION",
"ENERGY_COUNTER",
"FAULT_REPORTING",
"HUMIDITY",
"ILLUMINATION",
"LEVEL",
"LOWBAT",
"LOWBAT_REPORTING",
"LOW_BAT",
"MOTION",
"OPEN",
"POWER",
"PRESENCE_DETECTION_STATE",
"SET_POINT_MODE",
"SET_POINT_TEMPERATURE",
"SET_TEMPERATURE",
"STATE",
"TEMPERATURE",
"VALVE_STATE",
"VOLTAGE",
"PRESS_SHORT",
"PRESS_LONG",
"DB0"
]

class InterfaceConnection extends EventEmitter {

    constructor(interfaceName, config) {
        super();
        this.interfaceName = interfaceName;
        this._settings = config;
        this.failureCount = 0;
        this.maxFailureCount = 10;
        this.deactivated = false;
        this.connected = false;
        this.wasConnected = false;
        this.reconnectInterval = 10000;
        this.setMaxListeners.retrying = false;
        freeport((err, port) => {
            if (err) throw err;
            this.port = port;
            this.initRpcServerAndClient(port)
        });

    }

    getInitUrl() {
        return this._settings.protocol + "://" + this._settings.homeyIP + ":" + this.port;
    }

    retryConnect(self) {
        console.log("Check retry: ", self.interfaceName)
        if (self.failureCount > self.maxFailureCount && self.wasConnected == false) {
            console.log("Giving up on ", self.interfaceName)
            clearInterval(self.retryConnectTimer);
            self.retrying = false;
            return
        }
        if (self.connected == false) {
            console.log("Reconecting to ", self.interfaceName)
            self.failureCount += 1;
            self.initInterface(self.retryConnectTimer);
            return
        }
    }

    initRpcServerAndClient(port) {
        this.createRpcServer(port);
        this.rpcClient = this.createRpcClient();
        this.initInterface();
    }

    createRpcServer(port) {
        var self = this
        this.rpcServer = this._settings.rpc.createServer({ host: this._settings.homeyIP, port: port });

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
            if (used_keys.includes(event[2])) {
                let eventName = "event-" + this.interfaceName + "-" + event[1] + "-" + event[2]
                this.emit('event', {
                    'interfaceName': this.interfaceName,
                    'name': eventName,
                    'value': event[3]
                })
            } else {
                // console.log("Device " + this.interfaceName + " " + event[1] + " Key " + event[2] + " not in used_keys array");
            }
        } else {
            console.log("Wrong event: " + event)
        }
        this.lastEvent = now();
    }

    /**
     * Tell the CCU that we want to receive events
     */
    initInterface() {
        var self = this;
        this.rpcClient.methodCall('init', [self.getInitUrl(), 'homey_' + self.interfaceName], function (err, res) {
            if (err) {
                console.log("Failed to connect:", self.interfaceName, err)
                self.connected = false;
                if (!self.retrying) {
                    self.retrying = true;
                    self.retryConnectTimer = setInterval(self.retryConnect, self.reconnectInterval, self);
                }
            } else {
                console.log("Connected to", self.interfaceName)
                self.failureCount = 0;
                self.connected = true;
                self.wasConnected = true;
                self.retrying = false;
                clearInterval(self.retryConnectTimer);
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
            console.log("Sending ping to ", this.interfaceName)
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
        this.rpcClient.methodCall('init', [this.getInitUrl(), ''], function (err, res) {
        });
    }

    listDevices() {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self.connected) {
                resolve({ 'interfaceName': self.interfaceName, 'devices': [] })
            } else {
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
            }
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