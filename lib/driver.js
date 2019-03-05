'use strict';

const Homey = require('homey');

class Driver extends Homey.Driver {

  onInit() {
    this.multiDevice = false
    this.numDevices = 1
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
