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

  onPairListDevices(data, callback) {
    let devices = [];
    var self = this;

    Homey.app.hm.listDevices().then((data) => {
      Object.keys(data).forEach((interfaceName) => {
        for (var i = 0; i < data[interfaceName].length; i++) {
          if (data[interfaceName][i].TYPE === self.homematicType) {
            for (let idx = 0; idx < this.numDevices; idx++) {
              let device = {
                "name": this.getDeviceName(data[interfaceName][i].ADDRESS, idx),
                "capabilities": self.capabilities,
                "data": {
                  "id": data[interfaceName][i].ADDRESS,
                  "attributes": {
                    "HomeyInterfaceName": interfaceName
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

  getDeviceName(address, idx) {
    if (this.multiDevice == true) {
      return address + "-" + (idx + 1)
    } else {
      return address
    }
  }
}

module.exports = Driver;
