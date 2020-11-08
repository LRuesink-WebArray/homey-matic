'use strict';

const Homey = require('homey');
const Constants = require('./constants.js');

class Device extends Homey.Device {

  onInit(capabilityMap) {
    this.mylog = Homey.app.logmodule.log;
    this.driver = this.getDriver();
    this.capabilityMap = capabilityMap;
    this.deviceAddress = this.getData().id
    this.HomeyInterfaceName = this.getData().attributes.HomeyInterfaceName
    this.bridgeSerial = this.getSetting('ccuSerial');
    if (this.bridgeSerial === null || this.bridgeSerial === "") {
      this.bridgeSerial = this.getData().attributes.bridgeSerial;
    }
    var self = this;
    this.addedEvents = [];
    this.driver.getBridge({serial: this.bridgeSerial})
        .then(bridge => {
          self.bridge = bridge;
          self.initilizeCapabilities();
          self.registerCapabilityListeners();
          self.setSettings({
            address: self.deviceAddress,
            ccuIP: self.bridge.ccuIP,
            ccuSerial: self.bridge.serial,
            driver: self.driver.getManifest().id
          })
        })
        .catch(err => {
          this.error(err);
        });
  }

  onDeleted() {
    this.addedEvents.forEach((eventName) => {
      this.bridge.removeAllListeners(eventName);
    })
  }

  setValue(channel, key, value, callback) {
    var self = this;
    this.bridge.setValue(this.HomeyInterfaceName, this.deviceAddress + ':' + channel, key, value).then((res) => {
    }).then(() => {
      callback(null)
    }).catch((err) => {
      self.mylog('info', 'Set', key, 'failed for device - Value ' + value, this.deviceAddress)
      callback(new Error('Failed to set value', null));
    })
  }

  registerCapabilityListeners() {
    var self = this;
    Object.keys(this.capabilityMap).forEach((capabilityName) => {
      if (self.capabilityMap[capabilityName].set) {
        this.registerCapabilityListener(capabilityName, (value, opts, callback) => {
          let setValue = value;
          if (self.capabilityMap[capabilityName].set.convertMQTT && self.bridge.transport === Constants.TRANSPORT_MQTT) {
            setValue = self.capabilityMap[capabilityName].set.convertMQTT(value)
          } else if (self.capabilityMap[capabilityName].set.convert) {
            setValue = self.capabilityMap[capabilityName].set.convert(value)
          } else {
            setValue = this.convertValue(self.capabilityMap[capabilityName].set.valueType, value);
          }
          let key = self.capabilityMap[capabilityName].set.key
          // console.log(self.capabilityMap[capabilityName].set.convertKey)
          if (self.capabilityMap[capabilityName].set.convertKey) {
            key = self.capabilityMap[capabilityName].set.convertKey(key, value)
          }
          let channel = self.capabilityMap[capabilityName].set.channel
          if (self.capabilityMap[capabilityName].set.convertChannel) {
            key = self.capabilityMap[capabilityName].set.convertChannel(channel, value)
          }
          this.setValue(channel, key, setValue, callback)
        })
      }
    })
  }

  initilizeCapabilities() {
    var self = this;
    Object.keys(this.capabilityMap).forEach((name) => {
      // Setting initial values
      if (self.capabilityMap[name].channel && self.capabilityMap[name].key) {
        self.getCapabilityValue(name);
        self.initializeEventListener(name);
      }
    })
    self.initializeExtraEventListeners()
  }

  getCapabilityValue(capabilityName) {
    var self = this;
    this.bridge.getValue(self.HomeyInterfaceName, self.deviceAddress + ':' + self.capabilityMap[capabilityName].channel, self.capabilityMap[capabilityName].key).then((value) => {
      if (self.capabilityMap[capabilityName].convertMQTT && self.bridge.transport === Constants.TRANSPORT_MQTT) {
        value = self.capabilityMap[capabilityName].convertMQTT(value)
      } else if (self.capabilityMap[capabilityName].convert) {
        value = self.capabilityMap[capabilityName].convert(value)
      } else {
        value = this.convertValue(self.capabilityMap[capabilityName].valueType, value);
      }
      self.setCapabilityValue(capabilityName, value).catch((err) => {
        self.mylog('error', 'Failed to set capability ', capabilityName, 'for device ', self.getName(), '(', self.deviceAddress, ')', err);
      })
    }).catch((err) => {
    })
  }

  initializeEventListener(capabilityName) {
    var self = this;
    var eventName = 'event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + self.capabilityMap[capabilityName].channel + '-' + self.capabilityMap[capabilityName].key;
    this.bridge.on(eventName, (value) => {
      if (self.capabilityMap[capabilityName].convert) {
        value = self.capabilityMap[capabilityName].convert(value)
      } else {
        value = this.convertValue(self.capabilityMap[capabilityName].valueType, value);
      }
      self.setCapabilityValue(capabilityName, value).catch((err) => {
        self.mylog('error', 'Failed to set capability ', capabilityName, 'for device ', self.getName(), '(', self.deviceAddress, ')', err);
      })
    });
    self.addedEvents.push(eventName);
  }

  initializeExtraEventListeners() {
  }

  convertValue(valueType, value) {
    if (valueType === 'string') {
      value = value.toString();
    } else if (valueType === 'int') {
      value = parseInt(value)
    } else if (valueType === 'float') {
      value = parseFloat(value)
    } else if (valueType === 'boolean') {
      if (value === 0) {
        value = false
      } else if (value === 1) {
        value = true
      }
    } else if (valueType === 'onOffDimGet') {
      if (value > 0) {
        value = true
      } else {
        value = false
      }
    } else if (valueType === 'keymatic') {
      value = true;
    } else if (valueType === 'keymatic_swap') {
      if (value === true) {
        value = false
      } else {
        value = true
      }
    } else if (valueType === 'onOffDimSet') {
      if (value === true) {
        value = 0.99
      } else {
        value = "0.0"
      }
    } else if (valueType === 'Wh') {
      value = parseFloat(value) / 1000
    } else if (valueType === 'floatPercent') {
      value = parseFloat(value) * 100
    } else if (valueType === 'mA') {
      value = parseFloat(value) / 1000
    }
    return value;
  }
}


module.exports = Device;
