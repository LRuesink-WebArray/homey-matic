'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const HomeMaticCCUMQTT = require('./lib/HomeMaticCCUMQTT');
const HomeMaticCCURPC = require('./lib/HomeMaticCCURPC');
const Constants = require('./lib/constants');

class Homematic extends Homey.App {

    async onInit() {
        this.logmodule = require("./lib/logmodule");
        this.logmodule.log('info', 'Started homematic...');
        var self = this;
        Homey.ManagerCloud.getLocalAddress()
            .then((address) => {
                self.homeyIP = address.split(':')[0]
            })

        self.settings = self.getSettings();
        self.discovery = new HomeMaticDiscovery();
        self.bridges = {};
        if (Homey.app.settings.use_stored_bridges) {
          self.initializeStoredBridges();
        } else {
            await self.discovery.discover()
        }
    }

    getSettings() {
        return {
            "use_mqtt": Homey.ManagerSettings.get('use_mqtt'),
            "use_stored_bridges": Homey.ManagerSettings.get('use_stored_bridges'),
        }
    }

    getStoredBridges() {
      var self = this;
      var bridges = {};
      Homey.ManagerSettings.getKeys().forEach((key) => {
        if (key.startsWith(Constants.SETTINGS_PREFIX_BRIDGE)) {
          let bridge = Homey.ManagerSettings.get(key);
          bridges[bridge.serial] = bridge
        }
      })

      return bridges
    }

    initializeStoredBridges() {
      var self = this;
      var bridges = this.getStoredBridges();
      Object.keys(bridges).forEach((serial) => {
        let bridge = bridges[serial];
        self.logmodule.log('info', "Initializing stored ccu:", "Type", bridge.type, "Serial",  bridge.serial,"IP",  bridge.address);
        self.initializeBridge(bridge)
      });
    }

    initializeBridge(bridge) {
      var self = this;
      if (Homey.app.settings.use_mqtt == true) {
        self.logmodule.log('info', "Initializing MQTT CCU ");
        self.bridges[bridge.serial] = new HomeMaticCCUMQTT(bridge.type, bridge.serial, bridge.address);
      } else {
        self.logmodule.log('info', "Initializing RPC CCU");
        self.bridges[bridge.serial] = new HomeMaticCCURPC(bridge.type, bridge.serial, bridge.address);
      }
      return self.bridges[bridge.serial]
    }

    setBridgeAddress(serial, address) {
      var self = this;
      self.bridges[serial].address = address;
    }

    deleteStoredBridges() {
      var self = this;
      var bridges = this.getStoredBridges()
      Object.keys(bridges).forEach((serial) => {
        Homey.ManagerSettings.unset(Constants.SETTINGS_PREFIX_BRIDGE + serial)
      })
    }

    getLogLines() {
        return this.logmodule.getLogLines();
    }

}


module.exports = Homematic;
