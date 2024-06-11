'use strict';

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
    this.mqttReconnectInterval = 5000;

    this.jackClient = this.createJackClient(ccuIP, user, password);
    this.requestQueue = [];
    this.isProcessingQueue = false;

    this.homey.on('unload', () => this.cleanup());
  }

  createJackClient(ccuIP, user, password) {
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
    return axios.create(clientOptions);
  }

  enqueueRequest(request) {
    this.requestQueue.push(request);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    while (this.requestQueue.length > 0) {
            const requestBatch = this.requestQueue.splice(0, 10); // Batch of 10 requests
      try {
        await Promise.all(requestBatch.map(request => request()));
      } catch (error) {
        this.logger.log('error', 'Failed to process request:', error);
      }
    }
    this.isProcessingQueue = false;
  }

  subscribeTopic(name) {
    this.enqueueRequest(() => new Promise((resolve, reject) => {
      this.MQTTClient.subscribe(name, (err) => {
        if (err) {
          this.logger.log('error', 'Failed to subscribe to topic', name, err);
          return reject(err);
        }
        this.logger.log('info', 'Subscribed to topic', name);
        resolve();
      });
    }));
  }

  setupMqtt(user, password) {
    let options = {};
    if (user && password) {
      options.username = user;
      options.password = password;
    }
    this.MQTTClient = mqtt.connect('mqtt://' + this.ccuIP + ':' + this.mqttPort, options);
    this.MQTTClient.on('connect', () => {
      this.logger.log('info', 'Connected to CCU Jack broker at:', this.ccuIP + ':' + this.mqttPort);
      this.connected = true;
      this.subscribedTopics.forEach(topic => {
        this.subscribeTopic(topic);
      });
    });

    this.MQTTClient.on('message', (topic, message) => {
      if (topic.startsWith(mqttStatusPrefix)) {
        let devTopic = topic.replace(mqttStatusPrefix, '');
        let parts = devTopic.split('/');
        if (parts.length !== 3) {
          this.logger.log('error', 'Received malformed message', topic, devTopic, parts);
          return;
        }
        let [address, channel, datapoint] = parts;
        let msg = JSON.parse(message.toString());
        let eventName = this.getEventName(address, channel, datapoint);
        this.emit(eventName, msg.v);
      }
    });

    this.MQTTClient.on('close', () => {
      if (this.connected) {
        this.logger.log('info', 'MQTT disconnected');
      }
      this.connected = false;
      setTimeout(() => this.setupMqtt(user, password), this.mqttReconnectInterval);
    });

    this.MQTTClient.on('offline', () => {
      if (this.connected) {
        this.logger.log('info', 'MQTT went offline');
      }
      this.connected = false;
      setTimeout(() => this.setupMqtt(user, password), this.mqttReconnectInterval);
    });

    this.MQTTClient.on('error', (err) => {
      this.logger.log('error', 'MQTT connection error:', err);
      this.connected = false;
      setTimeout(() => this.setupMqtt(user, password), this.mqttReconnectInterval);
    });
  }

  getEventName(address, channel, datapoint) {
    return "event-" + address + ":" + channel + "-" + datapoint;
  }

  on(event, callback) {
    super.on(event, callback);

    const prefix = "event-";
    if (event.startsWith(prefix)) {
      let tmp = event.replace(prefix, "");
      let [channel, datapoint] = tmp.split("-");
      channel = channel.replace(":", "/");
      let topic = mqttStatusPrefix + channel + '/' + datapoint;
      if (!this.subscribedTopics.includes(topic)) {
        this.subscribedTopics.push(topic);
      }
      if (this.connected) {
        this.subscribeTopic(topic);
      }
    }
  }

  async listDevices() {
    return new Promise((resolve, reject) => {
      this.enqueueRequest(() => {
        return this.jackClient.get('device')
          .then(resp => {
            let deviceLinks = resp.data['~links'];
            let devPromises = deviceLinks.map(link => this.jackClient.get('device/' + link['href']));
            return Promise.all(devPromises)
              .then(results => {
                let devices = {};
                results.forEach(dev => {
                  let device = dev.data;
                  if (!devices[device.interfaceType]) {
                    devices[device.interfaceType] = [];
                  }
                  devices[device.interfaceType].push({
                    TYPE: device.type,
                    ADDRESS: device.address
                  });
                });
                resolve(devices);
              })
              .catch(err => {
                this.logger.log("error", "Failed to process devices:", err);
                reject(err);
              });
          })
          .catch(err => {
            this.logger.log("error", "Failed to get devices:", err);
            reject(err);
          });
      });
    });
  }

  async getValue(interfaceName, address, key) {
    return new Promise((resolve, reject) => {
      let valueURL = 'device/' + address.replace(':', '/') + '/' + key + '/~pv';
      this.enqueueRequest(() => {
        return this.jackClient.get(valueURL)
          .then(resp => {
            resolve(resp.data.v);
          })
          .catch(err => {
            this.logger.log("error", "Failed to get device value:", address, key, err);
            reject(new Error('Failed to get value'));
          });
      });
    });
  }

  async setValue(interfaceName, address, key, value) {
    let myValue = value;
    if (myValue === "1.0") {
      myValue = 1;
    } else if (myValue === "0.0") {
      myValue = 0;
    }
    return new Promise((resolve, reject) => {
      this.enqueueRequest(() => {
        return new Promise((resolveInner, rejectInner) => {
          this.MQTTClient.publish('device/set/' + address.replace(':', '/') + '/' + key, JSON.stringify(myValue), (err) => {
            if (err) {
              this.logger.log('error', 'Failed to publish message:', err);
              rejectInner(new Error('Failed to set value'));
            } else {
              resolveInner(true);
            }
          });
        }).then(resolve).catch(reject);
      });
    });
  }

  cleanup() {
    if (this.MQTTClient) {
      this.MQTTClient.end(true, () => {
        this.logger.log('info', 'MQTT client disconnected');
      });
    }
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }
}

module.exports = HomeMaticCCUJack;
