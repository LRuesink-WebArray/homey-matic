/*global module:true, require:false*/

const EventEmitter = require('events');
const axios = require('axios');
const mqtt = require('mqtt');
const Constants = require('./constants.js');

const mqttStatusPrefix = 'device/status/';

class HomeMaticCCUJack extends EventEmitter {
    constructor(logger, homey, type, serial, ccuIP, mqttPort, user, password) {
        super();
        this.homey = homey;
        this.logger = logger;
        this.ccuIP = ccuIP;
        this.mqttPort = mqttPort;
        this.type = type;
        this.transport = Constants.TRANSPORT_MQTT;
        this.serial = serial;
        this.homeyIP = this.homey.app.homeyIP;
        this.subscribedTopics = [];
        this.connected = false;
        this.setupMqtt(user, password);

        let clientOptions = {
            baseURL: 'http://' + ccuIP + ':2121/',
            timeout: 10000
        };

        if (user && password) {
            clientOptions.auth = {
                username: user,
                password: password
            };
        }
        this.jackClient = axios.create(clientOptions);
    }

    subscribeTopic(name) {
        let self = this;
        self.MQTTClient.subscribe(name, function(err) {
            if (err) {
                self.logger.log('error', 'Failed to subscribe to topic', name, err);
            } else {
                self.logger.log('info', 'Subscribed to topic', name);
            }
        });
    }

    setupMqtt(user, password) {
        let self = this;
        let options = {};
        if (user && password) {
            options.username = user;
            options.password = password;
        }
        this.MQTTClient = mqtt.connect('mqtt://' + self.ccuIP + ':' + self.mqttPort, options);
        this.MQTTClient.on('connect', function() {
            self.logger.log('info', 'Connected to CCU Jack broker at:', self.ccuIP + ':' + self.mqttPort);
            self.connected = true;
            self.subscribedTopics.forEach(topic => {
                self.subscribeTopic(topic);
            });
        });

        this.MQTTClient.on('message', function(topic, message) {
            if (topic.startsWith(mqttStatusPrefix)) {
                let devTopic = topic.replace(mqttStatusPrefix, '');
                let parts = devTopic.split('/');
                if (parts.length !== 3) {
                    self.logger.log('error', 'Received malformed message', topic, devTopic, parts);
                    return;
                }
                let address, channel, datapoint;
                [address, channel, datapoint] = parts;
                let msg = JSON.parse(message.toString());
                let eventName = self.getEventName(address, channel, datapoint);
                self.emit(eventName, msg.v);
            }
        });

        this.MQTTClient.on('close', function() {
            if (self.connected) {
                self.logger.log('info', 'MQTT disconnected');
            }
            self.connected = false;
        });

        this.MQTTClient.on('offline', function() {
            if (self.connected) {
                self.logger.log('info', 'MQTT went offline');
            }
            self.connected = false;
        });

        this.MQTTClient.on('error', function(err) {
            self.logger.log('error', 'MQTT connection error:', err);
            self.connected = false;
        });
    }

    getEventName(address, channel, datapoint) {
        return "event-" + address + ":" + channel + "-" + datapoint;
    }

    on(event, callback) {
        let self = this;
        super.on(event, callback);

        const prefix = "event-";
        if (event.startsWith(prefix)) {
            let tmp = event.replace(prefix, "");
            let channel, datapoint;
            [channel, datapoint] = tmp.split("-");
            channel = channel.replace(":", "/");
            let topic = mqttStatusPrefix + channel + '/' + datapoint;
            if (!self.subscribedTopics.includes(topic)) {
                self.subscribedTopics.push(topic);
            }
            if (self.connected) {
                self.subscribeTopic(topic);
            }
        }
    }

    async listDevices() {
        let self = this;
        let allDevices = [];

        return new Promise((resolve, reject) => {
            self.jackClient.get('device')
                .then(resp => {
                    let deviceLinks = resp.data['~links'];
                    let devPromises = [];
                    deviceLinks.forEach(link => {
                        let p = self.jackClient.get('device/' + link['href']);
                        devPromises.push(p);
                    });

                    Promise.all(devPromises)
                        .then(results => {
                            let devices = {};
                            for (let i = 0; i < results.length; i++) {
                                let dev = results[i].data;
                                if (devices[dev.interfaceType] === undefined) {
                                    devices[dev.interfaceType] = [];
                                }
                                devices[dev.interfaceType].push({
                                    TYPE: dev.type,
                                    ADDRESS: dev.address
                                });
                            }
                            resolve(devices);
                        })
                        .catch(err => {
                            self.logger.log("error", "Failed to process devices:", err);
                            reject(err);
                        });
                })
                .catch(err => {
                    self.logger.log("error", "Failed to get devices:", err);
                    reject(err);
                });
        });
    }

    getInterfaceName(dev) {
        if (dev.address.startsWith('CUX')) {
            return 'CUxD';
        }

        if (dev.type.toLowerCase().startsWith('hm-')) {
            return 'BidCos-RF';
        }

        if (dev.type.toLowerCase().startsWith('hmip-')) {
            return 'HmIP-RF';
        }

        return '';
    }

    async getValue(interfaceName, address, key) {
        let self = this;
        return new Promise(function(resolve, reject) {
            let valueURL = 'device/' + address.replace(':', '/') + '/' + key + '/~pv';
            self.jackClient.get(valueURL)
                .then(resp => {
                    resolve(resp.data.v);
                })
                .catch(err => {
                    self.logger.log("error", "Failed to get device value:", address, key, err);
                    reject(new Error('Failed to get value'));
                });
        });
    }

    async setValue(interfaceName, address, key, value) {
        let self = this;
        let myValue = value;
        if (myValue === "1.0") {
            myValue = 1;
        } else if (myValue === "0.0") {
            myValue = 0;
        }
        return new Promise(function(resolve, reject) {
            self.MQTTClient.publish('device/set/' + address.replace(':', '/') + '/' + key, JSON.stringify(myValue), function(err) {
                if (err) {
                    self.logger.log('error', 'Failed to publish message:', err);
                    reject(new Error('Failed to set value'));
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = HomeMaticCCUJack;
