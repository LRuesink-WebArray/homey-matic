/*global module:true, require:false*/

const EventEmitter = require('events');
// const BINRPC = require("binrpc");
const BINRPC = require("@twendt/binrpc");
const XMLRPC = require('homematic-xmlrpc');
const Connection = require('./connection.js');
const Homey = require('homey');
const MQTTClient = new Homey.ApiApp('nl.scanno.mqtt');

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
                protocol: 'http',
                ping: true,
                pingTimeout: 60,
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            },
            'HmIP-RF': {
                rpc: XMLRPC,
                port: 2010,
                protocol: 'http',
                ping: true, // Todo https://github.com/eq-3/occu/issues/42 - should be fixed, but isn't
                pingTimeout: 60, // Overwrites ccu-connection config
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            },
            'CUxD': {
                rpc: BINRPC,
                port: 8701,
                protocol: 'binrpc',
                ping: true,
                pingTimeout: 60,
                ccuIP: this.ccuIP,
                homeyIP: this.homeyIP
            }
        }

        MQTTClient
            .register()
            .on('install', () => this.register())
            .on('uninstall', () => this.unregister())
            .on('realtime', (topic, message) => this.onMessage(topic, message));
        
        MQTTClient.getInstalled()
            .then(installed => {
                if (installed) {
                    this.register();
                }
            })
            .catch(error => console.log(error));

        this.connections = {};
        this.createConnections();
    }

    onMessage(topic, message) {
        let eventName = "event-" + message.iface + "-" +message.channel + "-" + message.datapoint;
        console.log(eventName);
        this.emit(eventName, message.value);
        // console.log(topic + ": " + JSON.stringify(message, null, 2));
    }

    register() {
        MQTTClient.post(
            'subscribe', 
            { topic: 'homey/#' }, 
            (error) => console.log(error || 'subscribed to topic: homey/#')
        );

    }

    unregister() {}

    createConnections() {
        var self = this;
        Object.keys(this.interfaceConfigs).forEach((interfaceName) => {
            self.connections[interfaceName] = new Connection(interfaceName, self.interfaceConfigs[interfaceName])
            // self.connections[interfaceName].on('event', (event) => { self.emit(event.name, event.value) })
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