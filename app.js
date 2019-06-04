'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
class Homematic extends Homey.App {

  onInit() {
    var self = this;
    this.log('Started homematic...');
    Homey.ManagerCloud.getLocalAddress()
      .then((address) => {
        self.homeyIP = address.split(':')[0]
      })

    self.discovery = new HomeMaticDiscovery();
    this.bridges = {};
  }

}



module.exports = Homematic;
