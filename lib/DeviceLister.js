'use strict';

class DeviceLister {
  constructor(driver) {
    this.driver = driver;
  }

  async onListDevices(data, currentBridge) {
    if (!currentBridge) {
      return this.onListDevicesBridges();
    }
    return this.onListDevicesDevices(currentBridge);
  }

  async onListDevicesBridges() {
    const self = this.driver;
    try {
      await self.homey.app.discovery.discover();
      return Object.values(self.homey.app.bridges).map(bridge => ({
        name: `CCU(${bridge.address})`,
        data: {
          serial: bridge.serial,
        }
      }));
    } catch (err) {
      throw new Error('Discovery failed');
    }
  }

  async onListDevicesDevices(currentBridge) {
    const self = this.driver;
    if (!currentBridge) {
      throw new Error('Missing Bridge');
    }

    let devices = [];
    try {
      const bridgeDevices = await currentBridge.listDevices();
      Object.keys(bridgeDevices).forEach(interfaceName => {
        bridgeDevices[interfaceName].forEach(device => {
          if (self.homematicTypes.includes(device.TYPE)) {
            for (let idx = 0; idx < self.numDevices; idx++) {
              const deviceObj = {
                name: self.getDeviceName(device.ADDRESS, idx),
                capabilities: self.capabilities,
                data: {
                  id: device.ADDRESS,
                  attributes: {
                    HomeyInterfaceName: interfaceName,
                    bridgeSerial: currentBridge.serial
                  }
                }
              };
              if (self.multiDevice) {
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
  }
}

module.exports = DeviceLister;
