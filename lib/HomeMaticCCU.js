/*global module:true, require:false*/

const EventEmitter = require('events');
const BINRPC = require("binrpc");
const XMLRPC = require('homematic-xmlrpc');
const Connection = require('./connection.js');
const Homey = require('homey');

class HomeMaticCCU extends EventEmitter {
    constructor(type, serial, ccuIP) {
        super();
        this.ccuIP = ccuIP;
        this.type = type;
        this.serial = serial;
        this.homeyIP = Homey.app.homeyIP;
        this.interfaceConfigs = {
            'BidCos-RF': {
                rpc: XMLRPC,
                port: 2001,
                serverPort: 2031,
                protocol: 'http',
                ping: true,
                pingTimeout: 60,
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            },
            'HmIP-RF': {
                rpc: XMLRPC,
                port: 2010,
                serverPort: 2032,
                protocol: 'http',
                ping: true, // Todo https://github.com/eq-3/occu/issues/42 - should be fixed, but isn't
                pingTimeout: 60, // Overwrites ccu-connection config
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            },
            'CUxD': {
                rpc: BINRPC,
                port: 8701,
                serverPort: 2033,
                protocol: 'binrpc',
                ping: true,
                pingTimeout: 60,
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            }
        }

        this.connections = {};
        this.createConnections();
    }

    createConnections() {
        var self = this;
        Object.keys(this.interfaceConfigs).forEach((interfaceName) => {
            self.connections[interfaceName] = new Connection(interfaceName, self.interfaceConfigs[interfaceName])
            self.connections[interfaceName].on('event', (event) => { self.emit(event.name, event.value) })
        })
    }

    listDevices() {
        var self = this;
        var allDevices = [];
        Object.keys(this.interfaceConfigs).forEach((interfaceName) => {
            allDevices.push(self.connections[interfaceName].listDevices())
        })

        return new Promise(function (resolve, reject) {
            Promise.all(allDevices).then((results) => {
                var devices = {};
                for (var i = 0; i < results.length; i++) {
                    devices[results[i].interfaceName] = results[i].devices
                }
                resolve(devices)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getValue(interfaceName, address, key) {
        return this.connections[interfaceName].getValue(address, key)
    }

    setValue(interfaceName, address, key, value) {
        return this.connections[interfaceName].setValue(address, key, value)
    }
}

module.exports = HomeMaticCCU;