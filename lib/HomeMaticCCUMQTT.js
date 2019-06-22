/*global module:true, require:false*/

const EventEmitter = require('events');
// const BINRPC = require("binrpc");
const BINRPC = require("@twendt/binrpc");
const XMLRPC = require('homematic-xmlrpc');
const Connection = require('./connection.js');
const Homey = require('homey');
const fetch = require('node-fetch');
const mqtt = require('mqtt');

class HomeMaticCCUMQTT extends EventEmitter {
    constructor(type, serial, ccuIP) {
        super();
        this.ccuIP = ccuIP;
        this.type = type;
        this.serial = serial;
        this.homeyIP = Homey.app.homeyIP;
        this.setupMqtt();
    }

    setupMqtt() {
        var self = this;
        this.MQTTClient = mqtt.connect('mqtt://'+self.ccuIP);
        this.MQTTClient.on('connect', function() {
            console.log('Connected to broker at: ', self.ccuIP )
            self.MQTTClient.subscribe('hm/status/#', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Subscribed to topic hm/status/#");
                }
            })
            self.MQTTClient.subscribe('hm/devices/response', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Subscribed to topic hm/devices/response");
                }
            })
        })

        this.MQTTClient.on('message', function(topic, message) {
            if (topic.startsWith('hm/status/')) {
                var devTopic = topic.replace('hm/status/', '');
                var parts = devTopic.split('/');
                if (parts.length != 3 ) {
                    // console.log("Wrong message received: ", topic, devTopic, parts);
                    return
                }
                var iface, channel, datapoint;
                [iface, channel, datapoint] = parts;
                var msg = JSON.parse(message.toString());
                let eventName = self.getEventName(iface, channel, datapoint);
                // console.log(eventName, msg.val);
                self.emit(eventName, msg.val);
            } else if (topic.startsWith('hm/devices/response')) {
                self.emit('devicelist', JSON.parse(message.toString()))
            }
        });
    }

    getEventName(iface, channel, datapoint) {
        return "event-" + iface + "-" +channel + "-" + datapoint
    }

    listDevices() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.once('devicelist', devices => {
                // console.log("Received value: ", devices);
                resolve(devices)
            })
            self.MQTTClient.publish('hm/devices', '', function(err) {
                if (err) {
                    console.log('Failed to publish message: ', err);
                    reject(err);
                }
            });
        })
    }

    getValue(interfaceName, address, key) {
        const payload = {
            iface: interfaceName,
            channel: address,
            datapoint: key
        }
        var self = this;
        return new Promise(function(resolve, reject) {
            let eventName = self.getEventName(interfaceName, address, key);
            self.once(eventName, value => {
                // console.log("Received value: ", value);
                resolve(value)
            })
            self.MQTTClient.publish('hm/get', JSON.stringify(payload), function(err) {
                if (err) {
                    console.log('Failed to publish message: ', err);
                    reject(err);
                }
            });
        })
    }

    setValue(interfaceName, address, key, value) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.MQTTClient.publish('hm/set/'+address+'/'+key, JSON.stringify(value), function(err) {
                if (err) {
                    console.log('Failed to publish message: ', err);
                    reject(err);
                } else {
                    // console.log("Message published")
                }
            });
            resolve(true)
        })
    }

}

module.exports = HomeMaticCCUMQTT;