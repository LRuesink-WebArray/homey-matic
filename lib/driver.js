'use strict';

const Homey = require('homey');

class Driver extends Homey.Driver {

  onInit() {

  }

  onPairListDevices(data, callback) {

    let devices = [];
    let devices_grouped = [];


    Homey.app.hm.listDevices().then((data) => {
      Object.keys(data).forEach((interfaceName) => {
        for (var i = 0; i < data[interfaceName].length; i++) {
          if (data[interfaceName][i].TYPE === this.homematicType) {
            let device = {
              "name": data[interfaceName][i].ADDRESS,
              "capabilities": this.capabilities,
              "data": {
                "id": data[interfaceName][i].ADDRESS,
                "attributes": {
                  "HomeyInterfaceName": interfaceName
                }
              }
            }
            devices.push(device);
          }
        }
      })

      callback(null, devices);

    }).catch((err) => {
    })
  }

}

module.exports = Driver;
