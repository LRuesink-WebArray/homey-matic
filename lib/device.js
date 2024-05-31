'use strict';

const Homey = require('homey');
const Constants = require('./constants.js');

class Device extends Homey.Device {

  onInit(capabilityMap) {
    this.logger = this.homey.app.logger;
    this.capabilityMap = capabilityMap;
    this.deviceAddress = this.getData().id;
    this.HomeyInterfaceName = this.getData().attributes.HomeyInterfaceName;
    this.bridgeSerial = this.getSetting('ccuSerial');
    if (!this.bridgeSerial) {
      this.bridgeSerial = this.getData().attributes.bridgeSerial;
    }
    this.addedEvents = [];

    this.driver.getBridge({ serial: this.bridgeSerial })
      .then(bridge => {
        this.bridge = bridge;
        this.initilizeCapabilities();
        this.registerCapabilityListeners();
        return this.setSettings({
          address: this.deviceAddress,
          ccuIP: this.bridge.ccuIP,
          ccuSerial: this.bridge.serial,
          driver: this.driver.manifest.id
        });
      })
      .catch(err => {
        this.error('Failed to initialize device:', err);
      });
  }

  onDeleted() {
    this.addedEvents.forEach(eventName => {
      this.bridge.removeAllListeners(eventName);
    });
  }

  setValue(channel, key, value) {
    this.bridge.setValue(this.HomeyInterfaceName, `${this.deviceAddress}:${channel}`, key, value)
      .catch(err => {
      this.logger.log('info', 'Set', key, 'failed for device - Value', value, this.deviceAddress);
      throw new Error('Failed to set value');
      });
  }

  registerCapabilityListeners() {
    Object.keys(this.capabilityMap).forEach(capabilityName => {
      if (this.capabilityMap[capabilityName].set) {
        this.registerCapabilityListener(capabilityName, async (value, opts) => {
          let setValue = value;
          if (this.capabilityMap[capabilityName].set.convertMQTT && this.bridge.transport === Constants.TRANSPORT_MQTT) {
            setValue = this.capabilityMap[capabilityName].set.convertMQTT(value);
          } else if (this.capabilityMap[capabilityName].set.convert) {
            setValue = this.capabilityMap[capabilityName].set.convert(value);
          } else {
            setValue = this.convertValue(this.capabilityMap[capabilityName].set.valueType, value);
          }

          let key = this.capabilityMap[capabilityName].set.key;
          if (this.capabilityMap[capabilityName].set.convertKey) {
            key = this.capabilityMap[capabilityName].set.convertKey(key, value);
          }

          let channel = this.capabilityMap[capabilityName].set.channel;
          if (this.capabilityMap[capabilityName].set.convertChannel) {
            channel = this.capabilityMap[capabilityName].set.convertChannel(channel, value);
          }

          this.setValue(channel, key, setValue);
        });
      }
    });
  }

  initilizeCapabilities() {
    Object.keys(this.capabilityMap).forEach(name => {
      if (this.capabilityMap[name].channel && this.capabilityMap[name].key) {
        this.getCapabilityValue(name);
        this.initializeEventListener(name);
      }
    });
    this.initializeExtraEventListeners();
  }

  getCapabilityValue(capabilityName) {
    this.bridge.getValue(this.HomeyInterfaceName, `${this.deviceAddress}:${this.capabilityMap[capabilityName].channel}`, this.capabilityMap[capabilityName].key)
      .then(value => {
      value = this.convertCapabilityValue(value, capabilityName);
        return this.setCapabilityValue(capabilityName, value);
      })
      .catch(err => {
      this.logger.log('error', `Failed to get capability ${capabilityName} for device ${this.getName()} (${this.deviceAddress})`, err);
      });
  }

  initializeEventListener(capabilityName) {
    const eventName = `event-${this.deviceAddress}:${this.capabilityMap[capabilityName].channel}-${this.capabilityMap[capabilityName].key}`;
    this.bridge.on(eventName, async value => {
      value = this.convertCapabilityValue(value, capabilityName);
      if (value !== undefined) {
        await this.setCapabilityValue(capabilityName, value).catch(err => {
          this.logger.log('error', `Failed to set capability ${capabilityName} for device ${this.getName()} (${this.deviceAddress})`, err);
        });
      }
    });
    this.addedEvents.push(eventName);
  }

  initializeExtraEventListeners() {
    // Implement additional event listeners if needed
  }

  convertCapabilityValue(value, capabilityName) {
    const { convert, convertMQTT, valueType } = this.capabilityMap[capabilityName];
    if (convertMQTT && this.bridge.transport === Constants.TRANSPORT_MQTT) {
      return convertMQTT(value);
    } else if (convert) {
      return convert(value);
    } else {
      return this.convertValue(valueType, value);
    }
  }

  convertValue(valueType, value) {
    switch (valueType) {
      case 'string':
        return value.toString();
      case 'int':
        return parseInt(value);
      case 'float':
        return parseFloat(value);
      case 'boolean':
        return value === 1;
      case 'onOffDimGet':
        return value > 0;
      case 'keymatic':
        return true;
      case 'keymatic_swap':
        return !value;
      case 'onOffDimSet':
        return value ? 0.99 : "0.0";
      case 'Wh':
        return parseFloat(value) / 1000;
      case 'floatPercent':
        return parseFloat(value) * 100;
      case 'mA':
        return parseFloat(value) / 1000;
      default:
        return value;
    }
  }
}

module.exports = Device;
