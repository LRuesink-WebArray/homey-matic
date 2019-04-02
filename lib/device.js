'use strict';

const Homey = require('homey');

class Device extends Homey.Device {

  onInit(capabilityMap) {
    this.driver = this.getDriver();
    this.capabilityMap = capabilityMap;
    this.deviceAddress = this.getData().id
    this.HomeyInterfaceName = this.getData().attributes.HomeyInterfaceName
    this.bridgeSerial = this.getData().attributes.bridgeSerial;
    var self = this;
    this.addedEvents = [];
    this.driver.getBridge({ serial: this.bridgeSerial })
      .then(async bridge => {
        self.bridge = bridge;
        self.initilizeCapabilities();
        self.registerCapabilityListeners();
      }).catch(err => {
        this.error(err);
      });
  }

  onDeleted() {
    this.addedEvents.forEach((eventName) => {
      this.bridge.removeAllListeners(eventName);
    })
  }

  setValue(channel, key, value, callback) {
    this.bridge.setValue(this.HomeyInterfaceName, this.deviceAddress + ':' + channel, key, value).then((res) => {
    }).then(() => {
      callback(null)
    }).catch((err) => {
      console.log('Set', key, 'failed for device - Value ' + value, this.deviceAddress)
      callback(new Error('Failed to set value', null));
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
      self.setCapabilityValue(capabilityName, value).catch((err) => {
        console.log('Failed to set capability ', capabilityName, 'for device ', self.getName(), '(', self.deviceAddress, ')', err);
      })
    }).catch((err) => {
    })
  }

  initializeEventListener(capabilityName) {
    var self = this;
    var eventName = 'event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + self.capabilityMap[capabilityName].channel + '-' + self.capabilityMap[capabilityName].key;
    this.bridge.on(eventName, (value) => {
      value = this.convertValue(self.capabilityMap[capabilityName].valueType, value);
      self.setCapabilityValue(capabilityName, value).catch((err) => {
        console.log('Failed to set capability ', capabilityName, 'for device ', self.getName(), '(', self.deviceAddress, ')', err);
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
    } else if(valueType === 'keymatic') {
      value = true;
    } else if(valueType === 'keymatic_swap') {
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
    } else if (valueType === 'old_temp_get') {
      value = value.toFixed(2)
    } else if (valueType === 'old_temp_set') {
      value = value.toFixed(6)
    }
    return value;
  }
}


module.exports = Device;
