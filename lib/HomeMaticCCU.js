/*global module:true, require:false*/

const EventEmitter = require('events');
// const BINRPC = require("binrpc");
const BINRPC = require("@twendt/binrpc");
const XMLRPC = require('homematic-xmlrpc');
const Connection = require('./connection.js');
const Homey = require('homey');
const fetch = require('node-fetch');
const mqtt = require('mqtt');

class HomeMaticCCU extends EventEmitter {
    constructor(type, serial, ccuIP) {
        super();
        this.ccuIP = ccuIP;
        this.type = type;
        this.serial = serial;
        this.homeyIP = Homey.app.homeyIP;
        // this.interfaceConfigs = {
        //     'BidCos-RF': {
        //         rpc: XMLRPC,
        //         port: 2001,
        //         protocol: 'http',
        //         ping: true,
        //         pingTimeout: 60,
        //         ccuIP: this.ccuIP,
        //         homeyIP: this.homeyIP
        //     },
        //     'HmIP-RF': {
        //         rpc: XMLRPC,
        //         port: 2010,
        //         protocol: 'http',
        //         ping: true, // Todo https://github.com/eq-3/occu/issues/42 - should be fixed, but isn't
        //         pingTimeout: 60, // Overwrites ccu-connection config
        //         ccuIP: this.ccuIP,
        //         homeyIP: this.homeyIP
        //     },
        //     'CUxD': {
        //         rpc: BINRPC,
        //         port: 8701,
        //         protocol: 'binrpc',
        //         ping: true,
        //         pingTimeout: 60,
        //         ccuIP: this.ccuIP,
        //         homeyIP: this.homeyIP
        //     }
        // }
        this.setupMqtt();
        // this.connections = {};
        // this.createConnections();
    }

    setupMqtt() {
        var self = this;
        this.MQTTClient = mqtt.connect('mqtt://'+self.ccuIP);
        this.MQTTClient.on('connect', function() {
            self.MQTTClient.subscribe('hm/status/#', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Connect to MQTT broker");
                }
            })
        })

        this.MQTTClient.on('message', function(topic, message) {
            if (topic.startsWith('hm/status/')) {
                var devTopic = topic.replace('hm/status/', '');
                var parts = devTopic.split('/');
                if (parts.length != 3 ) {
                    console.log("Wrong message received: ", topic, devTopic, parts);
                    return
                }
                var iface, channel, datapoint;
                [iface, channel, datapoint] = parts;
                var msg = JSON.parse(message.toString());
                let eventName = "event-" + iface + "-" +channel + "-" + datapoint;
                console.log(eventName, msg.val);
                self.emit(eventName, msg.val);
            }
        });
    }

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
        // return this.connections[interfaceName].getValue(address, key)
        return new Promise(function (resolve, reject) {
            fetch('http://'+ this.ccuIP + '/addons/red/get_value?channel='+address+'&datapoint='+key+'&iface='+interfaceName)
             .then(res => res.json())
             .then(body => {
                 console.log(interfaceName + '-' + address + '-' + key + ': ' + body)
                resolve(body)})
             .catch(err => reject(err))
        })
    }

    setValue(interfaceName, address, key, value) {
        var self = this;
        return new Promise(function (resolve, reject) {
            const body = {
                channel: address,
                datapoint: key,
                value: value,
                iface: interfaceName
            }
            fetch('http://'+ self.ccuIP + '/addons/red/set_value', {
                    method: 'post',
                    body:    JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => reject(err))
            })
        // return this.connections[interfaceName].setValue(address, key, value)
    }
}

module.exports = HomeMaticCCU;