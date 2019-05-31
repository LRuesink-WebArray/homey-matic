'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const HomeMaticCCU = require('./lib/HomeMaticCCU');
class Homematic extends Homey.App {

  onInit() {
    var self = this;
    this.log('Started homematic...');
    Homey.ManagerCloud.getLocalAddress()
      .then((address) => {
        self.homeyIP = address.split(':')[0]
      })
      .then(function () {
        self.bridges = {};

        self.settings = self.getSettings();
        if (self.settings.ccu_host != "") {
          self.bridges["static"] = new HomeMaticCCU("CCU", "static", self.settings.ccu_host)
          return
        }
        self.discovery = new HomeMaticDiscovery();
      })

    // this.discovery.discover()

    // this.bridges = {};
  }

  getSettings() {
    return {
      "ccu_host": Homey.ManagerSettings.get('ccu_host'),
    }
  }
}



module.exports = Homematic;
