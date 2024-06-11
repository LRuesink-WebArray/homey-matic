'use strict';

const Homey = require('homey');
const DeviceLister = require('./DeviceLister');

class Driver extends Homey.Driver {

  onInit() {
    this.multiDevice = false;
    this.numDevices = 1;
    this.deviceLister = new DeviceLister(this);
  }

  getDeviceName(address, idx) {
    if (this.multiDevice === true) {
      return `${address}-${idx + 1}`;
    } else {
      return address;
    }
  }

  async getBridge({ serial }) {
    const bridges = this.homey.app.bridges;
    if (!serial && Object.keys(bridges).length > 0) {
      return bridges[Object.keys(bridges)[0]];
    }

    if (bridges[serial]) {
      return bridges[serial];
    }

    await this.homey.app.discovery.discover();

    if (!serial && Object.keys(bridges).length > 0) {
      return bridges[Object.keys(bridges)[0]];
    }

    if (bridges[serial]) {
      return bridges[serial];
    }

    throw new Error('Bridge not found');
  }

  async onPair(session) {
    let currentBridge;
    const self = this;

    session.setHandler('list_devices', (data) => self.deviceLister.onListDevices(data, currentBridge));
    session.setHandler('list_bridges_selection', (data) => {
      currentBridge = self.homey.app.bridges[data[0].data.serial];
    });
  }
}

module.exports = Driver;
