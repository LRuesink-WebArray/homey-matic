/*global module:true, require:false*/

const EventEmitter = require('events');
const Homey = require('homey');
const axios = require('axios').default;
const mqtt = require('mqtt');
const Constants = require('./constants.js');

const mqttStatusPrefix = 'device/status/'

class HomeMaticCCUJack extends EventEmitter {
    constructor(type, serial, ccuIP) {
        super();
        this.log = Homey.app.logmodule.log;
        this.ccuIP = ccuIP;
        this.type = type;
        this.transport = Constants.TRANSPORT_MQTT;
        this.serial = serial;
        this.homeyIP = Homey.app.homeyIP;
        this.subscribedTopics = [];
        this.connected = false;
        this.setupMqtt();
        this.jackClient = axios.create({
            baseURL: 'http://'+ccuIP+':2121/',
            timeout: 10000
        });
    }

    subscribeTopic(name) {
        var self = this;
        self.MQTTClient.subscribe(name, function(err) {
            if (err) {
                self.log('error', err);
            } else {
                // self.log('info', "Subscribed to topic", name);
            }
        })
    }
    setupMqtt() {
        var self = this;
        this.MQTTClient = mqtt.connect('mqtt://'+self.ccuIP+':1885');
        this.MQTTClient.on('connect', function() {
            self.log('info', 'Connected to CCU Jack broker at: ', self.ccuIP + ':1885' )
            self.connected = true;
            self.subscribedTopics.forEach(topic => {
                self.subscribeTopic(topic);
            })
        })

        this.MQTTClient.on('message', function(topic, message) {
            if (topic.startsWith(mqttStatusPrefix)) {
                var devTopic = topic.replace(mqttStatusPrefix, '');
                var parts = devTopic.split('/');
                if (parts.length != 3 ) {
                    // console.log("Wrong message received: ", topic, devTopic, parts);
                    return
                }
                var address, channel, datapoint;
                [address, channel, datapoint] = parts;
                var msg = JSON.parse(message.toString());
                let eventName = self.getEventName(address, channel, datapoint);
                //self.log("info", "Emitting event", eventName, "with value", msg.v)
                self.emit(eventName, msg.v);
            }
        });
      
        this.MQTTClient.on('close', function() {
            if (self.connected) {
                self.log('info', 'MQTT disconnected')
            }
            self.connected = false;
        })

        this.MQTTClient.on('offline', function() {
            if (self.connected) {
                self.log('info', 'MQTT disconnected')
            }
            self.connected = false;
        })

        this.MQTTClient.on('error', function(err) {
            self.log('error', 'MQTT error connecting:', err)
            self.connected = false;
        })

    }

    getEventName(address, channel, datapoint) {
        return "event-" + address + ":" +channel + "-" + datapoint
    }

    on(event, callback) {
        var self = this;
        super.on(event, callback);

       const prefix = "event-";
       if (event.startsWith(prefix)) {
           var tmp = event.replace(prefix, "");
           var channel, datapoint;
           [channel, datapoint] = tmp.split("-");
           channel = channel.replace(":", "/")
           var topic = mqttStatusPrefix+channel+'/'+datapoint;
           if (!self.subscribedTopics.includes(topic)) {
               self.subscribedTopics.push(topic);
           }
           if (self.connected) {
               //self.log("info", "Subscribing topic", topic)
               self.subscribeTopic(topic);
           }
       }
    }

    async listDevices() {
        var self = this;
        var allDevices = [];

        return new Promise((resolve, reject) => {
            self.jackClient.get('device')
                .then(resp => {
                    let deviceLinks = resp.data['~links']
                    let devPromises = []
                    deviceLinks.forEach(link => {
                        let p = self.jackClient.get('device/' + link['href'])
                        devPromises.push(p)
                    })

                    Promise.all(devPromises)
                        .then(results => {
                            var devices = {};
                            for (var i = 0; i < results.length; i++) {
                                let dev = results[i].data
                                if (devices[dev.interfaceType] === undefined) {
                                    devices[dev.interfaceType] = []
                                }
                                devices[dev.interfaceType].push({
                                    TYPE: dev.type,
                                    ADDRESS: dev.address
                                })
                            }
                            resolve(devices)
                        })
                        .catch(err => {
                            self.log("error", "Failed to process devices:", err)
                            reject(err)
                        })
                })
                .catch(err => {
                    console.log("error", "Failed to get devices:", err)
                    reject(err)
                })
        })
    }

    getInterfaceName(dev) {
        if (dev.address.startsWith('CUX')) {
            return 'CUxD'
        }

        if (dev.type.toLowerCase().startsWith('hm-')) {
            return 'BidCos-RF'
        }

        if (dev.type.toLowerCase().startsWith('hmip-')) {
            return 'HmIP-RF'
        }

        return ''
    }

    getValue(interfaceName, address, key) {
        var self = this;
        return new Promise(function(resolve, reject) {
            let valueURL = 'device/'+address.replace(':', '/') + '/' + key + '/~pv';
            self.jackClient.get(valueURL)
                .then(resp =>{
                    resolve(resp.data.v)
                })
                .catch(err => {
                    self.log("error", "Failed to get device value:", address, key, err)
                    reject(err)
                })
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
            self.MQTTClient.publish('device/set/'+address.replace(':', '/')+'/'+key, JSON.stringify(myValue), function(err) {
                if (err) {
                    self.log('error', 'Failed to publish message: ', err);
                    reject(err);
                } else {
                    // console.log("Message published")
                }
            });
            resolve(true)
        })
    }

}

module.exports = HomeMaticCCUJack;