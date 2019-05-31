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
        this.homeyIP = address.split(':')[0]
      })

    this.bridges = {};

    this.settings = this.getSettings();
    if (this.settings.ccu_host != "") {
      this.bridges["static"] = new HomeMaticCCU("CCU", "static", this.settings.ccu_host)
      return
    }
    this.discovery = new HomeMaticDiscovery();
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
