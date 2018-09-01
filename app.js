'use strict';

const Homey = require('homey');
const HM = require('./lib/homematic.js')

class Homematic extends Homey.App {

  onInit() {
    var self = this;
    this.log('Started homematic...');
    var settings = this.getSettings();

    this.hm = new HM(settings.ccu_host, settings.homey_ip, this.log);

  }

  getSettings() {
    return {
      "ccu_host": Homey.ManagerSettings.get('ccu_host'),
      "homey_ip": Homey.ManagerSettings.get('homey_ip')
    }
  }
}

module.exports = Homematic;
