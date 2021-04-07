/*global module:true, require:false*/

const EventEmitter = require('events');
const mqtt = require('mqtt');
const Constants = require('./constants.js');

const supportedInterfaces = [
    "CUxD",
    "HmIP-RF",
    "BidCos-RF"
]
class HomeMaticCCUMQTT extends EventEmitter {
    constructor(logger, homey, type, serial, ccuIP) {
        super();
        this.homey = homey;
        this.logger = logger;
        this.ccuIP = ccuIP;
        this.type = type;
        this.transport = Constants.TRANSPORT_MQTT;
        this.serial = serial;
        this.homeyIP = this.homey.app.homeyIP;
        this.subscribedTopics = [];
        this.connected = false;
        this.setupMqtt();
    }

    subscribeTopic(name) {
        var self = this;
        self.MQTTClient.subscribe(name, function(err) {
            if (err) {
                self.logger.log('error', err);
            } else {
                // self.logger.log('info', "Subscribed to topic", name);
            }
        })
    }
    setupMqtt() {
        var self = this;
        this.MQTTClient = mqtt.connect('mqtt://'+self.ccuIP);
        this.MQTTClient.on('connect', function() {
            self.logger.log('info', 'Connected to broker at: ', self.ccuIP )
            self.connected = true;
            self.subscribedTopics.forEach(topic => {
                self.subscribeTopic(topic);
            })
            self.subscribeTopic('hm/devices/response')
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
                let eventName = self.getEventName(channel, datapoint);
                // console.log(eventName, msg.val);
                self.emit(eventName, msg.val);
            } else if (topic.startsWith('hm/devices/response')) {
                var devices =  JSON.parse(message.toString());
                var iface = devices.interfaceName;
                self.emit('devicelist-'+iface, devices)
            }
        });
      
        this.MQTTClient.on('close', function() {
            if (self.connected) {
                self.logger.log('info', 'MQTT disconnected')
            }
            self.connected = false;
        })

        this.MQTTClient.on('offline', function() {
            if (self.connected) {
                self.logger.log('info', 'MQTT disconnected')
            }
            self.connected = false;
        })

        this.MQTTClient.on('error', function(err) {
            self.logger.log('error', 'MQTT error connecting:', err)
            self.connected = false;
        })

    }

    getEventName(channel, datapoint) {
        return "event-" + channel + "-" + datapoint
    }

    on(event, callback) {
        var self = this;
        super.on(event, callback);
        supportedInterfaces.forEach(iface => {
            let prefix = "event-";
            if (event.startsWith(prefix)) {
                var tmp = event.replace(prefix, "");
                var channel, datapoint;
                [channel, datapoint] = tmp.split("-");
                var topic = 'hm/status/'+iface+'/'+channel+'/'+datapoint;
                if (!self.subscribedTopics.includes(topic)) {
                    self.subscribedTopics.push(topic);
                }
                if (self.connected) {
                    self.subscribeTopic(topic);
                }
            }
        })
    }

    listDevices() {
        var self = this;
        var allDevices = [];
        supportedInterfaces.forEach(iface => {
            allDevices.push(self.listInterfaceDevices(iface));
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

    listInterfaceDevices(iface) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var timeout;
            var listener = self.once('devicelist-'+iface, devices => {
                clearTimeout(timeout);
                resolve(devices)
            })
            timeout = setTimeout(() => {
                clearTimeout(listener);
                resolve({
                    interfaceName: iface,
                    devices: []
                })
            }, 10000);
            self.MQTTClient.publish('hm/devices', iface, function(err) {
                if (err) {
                    self.logger.log('error', 'Failed to publish message: ', err);
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
            let eventName = self.getEventName(address, key);
            self.once(eventName, value => {
                // console.log("Received value: ", value);
                resolve(value)
            })
            self.MQTTClient.publish('hm/get', JSON.stringify(payload), function(err) {
                if (err) {
                    self.logger.log('error', 'Failed to publish message: ', err);
                    reject(err);
                }
            });
        })
    }

    setValue(interfaceName, address, key, value) {
        var self = this;
        var myValue = value;
        if (myValue === "1.0") {
            myValue = 1
        } else if (myValue === "0.0") {
            myValue = 0
        }
        return new Promise(function(resolve, reject) {
            self.MQTTClient.publish('hm/set/'+address+'/'+key, JSON.stringify(myValue), function(err) {
                if (err) {
                    self.logger.log('error', 'Failed to publish message: ', err);
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