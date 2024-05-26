'use strict';

const Homey = require('homey');

class Driver extends Homey.Driver {

  onInit() {
    this.multiDevice = false;
    this.numDevices = 1;
  }

  async getBridge({ serial }) {
    if (!serial && Object.keys(this.homey.app.bridges).length > 0) {
      return this.homey.app.bridges[Object.keys(this.homey.app.bridges)[0]];
    }

    if (this.homey.app.bridges[serial]) {
      return this.homey.app.bridges[serial];
    }

    await this.homey.app.discovery.discover();

    if (!serial && Object.keys(this.homey.app.bridges).length > 0) {
      return this.homey.app.bridges[Object.keys(this.homey.app.bridges)[0]];
    }

    if (this.homey.app.bridges[serial]) {
      return this.homey.app.bridges[serial];
    }

    throw new Error('Bridge not found');
  }

  async onPair(session) {
    let currentBridge;
    const self = this;

    const onListDevices = (data) => {
      if (!currentBridge) {
        return onListDevicesBridges(data);
      }
      return onListDevicesDevices(data);
    };

    const onListDevicesBridges = async (data) => {
      try {
        await self.homey.app.discovery.discover();
        const result = Object.values(self.homey.app.bridges).map(bridge => ({
          name: `CCU(${bridge.address})`,
          data: {
            serial: bridge.serial,
          }
        }));

        return result;
      } catch (err) {
        throw new Error('Discovery failed');
      }
    };

    const onListDevicesDevices = async (data) => {
      if (!currentBridge) {
        throw new Error('Missing Bridge');
      }

      let devices = [];

      try {
        const bridgeDevices = await currentBridge.listDevices();
        Object.keys(bridgeDevices).forEach(interfaceName => {
          bridgeDevices[interfaceName].forEach(device => {
            if (self.homematicTypes.includes(device.TYPE)) {
              for (let idx = 0; idx < this.numDevices; idx++) {
                const deviceObj = {
                  name: this.getDeviceName(device.ADDRESS, idx),
                  capabilities: self.capabilities,
                  data: {
                    id: device.ADDRESS,
                    attributes: {
                      HomeyInterfaceName: interfaceName,
                      bridgeSerial: currentBridge.serial
                    }
                  }
                };
                if (this.multiDevice) {
                  deviceObj.data.attributes.Index = idx;
                }
                devices.push(deviceObj);
              }
            }
          });
        });
      } catch (err) {
        throw new Error('Failed to list devices: ' + err);
      }

      return devices;
    };

    const onListBridgesSelection = async (data) => {
      currentBridge = self.homey.app.bridges[data[0].data.serial];
    };

    session.setHandler('list_devices', onListDevices);
    session.setHandler('list_bridges_selection', onListBridgesSelection);
  }

  getDeviceName(address, idx) {
    if (this.multiDevice) {
      return `${address}-${idx + 1}`;
    } else {
      return address;
    }
  }
}

module.exports = Driver;
