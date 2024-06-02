'use strict';

const Homey = require('homey');
const CapabilityManager = require('./CapabilityManager');

class Device extends Homey.Device {

  async onInit(capabilityMap) {
    this.logger = this.homey.app.logger;
    this.logger.log('info', `Initializing device with capability map: ${JSON.stringify(capabilityMap)}`);
    this.capabilityMap = capabilityMap;
    this.deviceAddress = this.getData().id;
    this.HomeyInterfaceName = this.getData().attributes.HomeyInterfaceName;
    this.bridgeSerial = this.getSetting('ccuSerial') || this.getData().attributes.bridgeSerial;
    this.addedEvents = [];

    try {
      this.bridge = await this.driver.getBridge({ serial: this.bridgeSerial });
      this.logger.log('info', `Bridge found: ${this.bridgeSerial}`);
      this.capabilityManager = new CapabilityManager(this, this.capabilityMap);  // Moved this line here
      this.capabilityManager.initializeCapabilities();
      this.capabilityManager.registerCapabilityListeners();

      await this.setSettings({
        address: this.deviceAddress,
        ccuIP: this.bridge.ccuIP,
        ccuSerial: this.bridge.serial,
        driver: this.driver.manifest.id
      });
    } catch (err) {
      this.error('Failed to initialize device:', err);
    }
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
}

module.exports = Device;
