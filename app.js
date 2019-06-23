'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
class Homematic extends Homey.App {

  onInit() {
    this.logmodule = require("./lib/logmodule");
    this.logmodule.log('info', 'Started homematic...');
    var self = this;
    Homey.ManagerCloud.getLocalAddress()
      .then((address) => {
        self.homeyIP = address.split(':')[0]
      })

    self.settings = self.getSettings();
    self.discovery = new HomeMaticDiscovery();
    this.bridges = {};
  }

  getSettings() {
    return {
      "use_mqtt": Homey.ManagerSettings.get('use_mqtt'),
    }
  }

  getLogLines() {
    return this.logmodule.getLogLines();
 }

}



module.exports = Homematic;
