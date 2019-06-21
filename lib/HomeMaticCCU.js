/*global module:true, require:false*/

const EventEmitter = require('events');
// const BINRPC = require("binrpc");
const BINRPC = require("@twendt/binrpc");
const XMLRPC = require('homematic-xmlrpc');
const Connection = require('./connection.js');
const Homey = require('homey');
//const MQTTClient = new Homey.ApiApp('nl.scanno.mqtt');
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

        // MQTTClient
        //     .register()
        //     .on('install', () => this.register())
        //     .on('uninstall', () => this.unregister())
        //     .on('realtime', (topic, message) => this.onMessage(topic, message));
        
        // MQTTClient.getInstalled()
        //     .then(installed => {
        //         if (installed) {
        //             this.register();
        //         }
        //     })
        //     .catch(error => console.log(error));
        var self = this;
        this.MQTTClient = mqtt.connect('mqtt://192.168.1.85');
        this.MQTTClient.on('connect', function() {
            self.MQTTClient.subscribe('hm/status/#', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Connect to MQTT broker");
                }
            })
        })

        this.MQTTClient.on('message', self.onMessage);
        // this.connections = {};
        // this.createConnections();
    }

    onMessage(topic, message) {
        if (topic.startsWith('hm/status/')) {
            var devTopic = topic.replace('hm/status/', '');
            var parts = devTopic.split('/');
            if (parts.length != 3 ) {
                console.log("Wrong message received: ", topic, devTopic, parts);
                return
            }
            var iface, channel, datapoint;
            [iface, channel, datapoint] = parts;
            var value = JSON.parse(message.toString());
            let eventName = "event-" + iface + "-" +channel + "-" + datapoint;
            console.log(eventName, value);
            this.emit(eventName, value);
        }
    }

    // register() {
    //     MQTTClient.post(
    //         'subscribe', 
    //         { topic: 'homey/#' }, 
    //         (error) => console.log(error || 'subscribed to topic: homey/#')
    //     );

    // }

    // unregister() {}

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
            fetch('http://192.168.1.85/addons/red/get_value?channel='+address+'&datapoint='+key+'&iface='+interfaceName)
             .then(res => res.json())
             .then(body => {
                 console.log(interfaceName + '-' + address + '-' + key + ': ' + body)
                resolve(body)})
             .catch(err => reject(err))
        })
    }

    setValue(interfaceName, address, key, value) {
        return new Promise(function (resolve, reject) {
            const body = {
                channel: address,
                datapoint: key,
                value: value,
                iface: interfaceName
            }
            fetch('http://192.168.1.85/addons/red/set_value', {
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