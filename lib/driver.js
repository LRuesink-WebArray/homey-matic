'use strict';

const Homey = require('homey');

class Driver extends Homey.Driver {

  onInit() {
    this.multiDevice = false
    this.numDevices = 1
  }

  async getBridge({ serial }) {
    //backwards compatibility
    if (serial === undefined && Object.keys(Homey.app.bridges).length > 0) {
      return Homey.app.bridges[Object.keys(Homey.app.bridges)[0]]
    }

    if (Homey.app.bridges[serial])
      return serial;

    Homey.app.bridges = await Homey.app.discovery.discover();
    //backwards compatibility
    if (serial === undefined && Object.keys(Homey.app.bridges).length > 0) {
      return Homey.app.bridges[Object.keys(Homey.app.bridges)[0]]
    }

    if (Homey.app.bridges[serial])
      return Homey.app.bridges[serial];

    throw new Error('Bridge not found');
  }

  async onPair(socket) {
    let bridges;
    let currentBridge;

    const onListDevices = (data, callback) => {
      if (!currentBridge)
        return onListDevicesBridges(data, callback);

      return onListDevicesDevices(data, callback);
    }

    const onListDevicesBridges = (data, callback) => {
      Homey.app.discovery.discover()
        .then(foundBridges => {
          bridges = foundBridges;
          const result = Object.values(bridges).map(bridge => {
            return {
              name: bridge.type,
              data: {
                serial: bridge.serial,
              }
            }
          });
          callback(null, result);
        }).catch(callback);
    }

    const onListDevicesDevices = (data, callback) => {
      if (!currentBridge)
        return callback(new Error('Missing Bridge'));

      let devices = [];
      var self = this;

      currentBridge.listDevices().then((data) => {
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

        callback(null, devices);

      }).catch((err) => {
      })

    }

    const onListBridgesSelection = (data, callback) => {
      callback();
      currentBridge = bridges[data[0].data.serial];
    }

    socket.on('list_devices', onListDevices);
    socket.on('list_bridges_selection', onListBridgesSelection);

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
