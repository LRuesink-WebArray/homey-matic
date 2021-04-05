'use strict';

const Homey = require('homey');

class Driver extends Homey.Driver {

  onInit() {
    this.multiDevice = false
    this.numDevices = 1
  }

  async getBridge({ serial }) {
    let self = this;
    //backwards compatibility
    if (serial === undefined && Object.keys(this.homey.app.bridges).length > 0) {
      return this.homey.app.bridges[Object.keys(this.homey.app.bridges)[0]]
    }

    if (this.homey.app.bridges[serial])
      return this.homey.app.bridges[serial];

    //self.homey.app.bridges = await self.homey.app.discovery.discover();
    await this.homey.app.discovery.discover();
    //backwards compatibility
    if (serial === undefined && Object.keys(this.homey.app.bridges).length > 0) {
      return self.homey.app.bridges[Object.keys(this.homey.app.bridges)[0]]
    }

    if (this.homey.app.bridges[serial])
      return this.homey.app.bridges[serial];

    throw new Error('Bridge not found');
  }

  async onPair(session) {
    let currentBridge;
    let self = this;

    const onListDevices = (data) => {
      if (!currentBridge)
        return onListDevicesBridges(data);

      return onListDevicesDevices(data);
    }

    const onListDevicesBridges = async (data) => {
      try {
        await self.homey.app.discovery.discover()

        const result = Object.values(self.homey.app.bridges).map(bridge => {
          return {
            name: "CCU(" + bridge.address + ")",
            data: {
              serial: bridge.serial,
            }
          }
        });

        return result;

      } catch (err) {
        throw new Error('Discovery failed')
      }
    }

    const onListDevicesDevices = async (data) => {
      if (!currentBridge)
        throw new Error('Missing Bridge');

      let devices = [];
      var self = this;

      currentBridge.listDevices().then(async (data) => {
        Object.keys(data).forEach((interfaceName) => {
          for (var i = 0; i < data[interfaceName].length; i++) {
            if (self.homematicTypes.includes(data[interfaceName][i].TYPE)) {
              for (let idx = 0; idx < this.numDevices; idx++) {
                let device = {
                  "name": this.getDeviceName(data[interfaceName][i].ADDRESS, idx),
                  "capabilities": self.capabilities,
                  "data": {
                    "id": data[interfaceName][i].ADDRESS,
                    "attributes": {
                      "HomeyInterfaceName": interfaceName,
                      "bridgeSerial": currentBridge.serial
                    }
                  }
                }
                if (this.multiDevice) {
                  device.data.attributes.Index = idx
                }
                devices.push(device);
              }
            }
          }
        })

        return devices;

      }).catch((err) => {
        throw new Error('Failed to list devices')
      })

    }

    const onListBridgesSelection = async (data) => {
      currentBridge = self.homey.app.bridges[data[0].data.serial];
    }

    session.setHandler('list_devices', onListDevices);
    session.setHandler('list_bridges_selection', onListBridgesSelection);

  }

  getDeviceName(address, idx) {
    if (this.multiDevice == true) {
      return address + "-" + (idx + 1)
    } else {
      return address
    }
  }
}

module.exports = Driver;
