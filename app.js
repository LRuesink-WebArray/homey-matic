'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const inspector = require('inspector');
class Homematic extends Homey.App {

  onInit() {
    // inspector.open(9229, '0.0.0.0');
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
