'use strict';

const Homey = require('homey');

class Device extends Homey.Device {

  onInit(capabilityMap) {
    this.driver = this.getDriver();
    this.capabilityMap = capabilityMap;
    this.deviceAddress = this.getData().id
    this.HomeyInterfaceName = this.getData().attributes.HomeyInterfaceName
    this.bridgeSerial = this.getData().attributes.BridgeSerial;
    var self = this;
    this.driver.getBridge({ serial: this.bridgeSerial })
      .then(async bridge => {
        self.bridge = bridge;
        self.initilizeCapabilities();
        self.registerCapabilityListeners();
      }).catch(err => {
        this.error(err);
      });
  }

  setValue(channel, key, value, callback) {
    this.bridge.setValue(this.HomeyInterfaceName, this.deviceAddress + ':' + channel, key, value).then((res) => {
    }).then(() => {
      callback(null)
    }).catch((err) => {
      return Promise.reject(new Error('Set', key, 'failed failed!'));
    })
  }

  registerCapabilityListeners() {
    var self = this;
    Object.keys(this.capabilityMap).forEach((capabilityName) => {
      if (self.capabilityMap[capabilityName].set) {
        this.registerCapabilityListener(capabilityName, (value, opts, callback) => {
          value = this.convertValue(self.capabilityMap[capabilityName].set.valueType, value);
          this.setValue(self.capabilityMap[capabilityName].set.channel, self.capabilityMap[capabilityName].set.key, value, callback)
        })
      }
    })
  }

  initilizeCapabilities() {
    var self = this;
    Object.keys(this.capabilityMap).forEach((name) => {
      // Setting initial values
      self.getCapabilityValue(name);
      self.initializeEventListener(name);
    })
    self.initializeExtraEventListeners()
  }

  getCapabilityValue(capabilityName) {
    var self = this;
    this.bridge.getValue(self.HomeyInterfaceName, self.deviceAddress + ':' + self.capabilityMap[capabilityName].channel, self.capabilityMap[capabilityName].key).then((value) => {
      value = this.convertValue(self.capabilityMap[capabilityName].valueType, value);
      self.setCapabilityValue(capabilityName, value)
    }).catch((err) => {
    })
  }

  initializeEventListener(capabilityName) {
    var self = this;
    this.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + self.capabilityMap[capabilityName].channel + '-' + self.capabilityMap[capabilityName].key, (value) => {
      value = this.convertValue(self.capabilityMap[capabilityName].valueType, value);
      self.setCapabilityValue(capabilityName, value)
    });
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
    } else if (valueType === 'onOffDimSet') {
      if (value === true) {
        value = 0.99
      } else {
        value = 0
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
