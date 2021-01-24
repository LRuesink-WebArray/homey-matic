'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const HomeMaticCCUMQTT = require('./lib/HomeMaticCCUMQTT');
const HomeMaticCCURPC = require('./lib/HomeMaticCCURPC');
const HomeMaticCCUJack = require('./lib/HomeMaticCCUJack');
const Constants = require('./lib/constants');

const connTypeRPC = 'use_rpc'
const connTypeMQTT = 'use_mqtt'
const connTypeCCUJack = 'use_ccu_jack'

class Homematic extends Homey.App {

    async onInit() {
        this.logmodule = require("./lib/logmodule");
        this.logmodule.log('info', 'Started homematic...');
        var self = this;
        let address = await Homey.ManagerCloud.getLocalAddress()
        self.homeyIP = address.split(':')[0]
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
            "connection_type": Homey.ManagerSettings.get('connection_type'),
            "ccu_jack_mqtt_port": Homey.ManagerSettings.get('ccu_jack_mqtt_port'),
            "ccu_jack_user": Homey.ManagerSettings.get('ccu_jack_user'),
            "ccu_jack_password": Homey.ManagerSettings.get('ccu_jack_password'),
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
            self.logmodule.log('info', "Initializing stored ccu:", "Type", bridge.type, "Serial", bridge.serial, "IP", bridge.address);
            self.initializeBridge(bridge)
        });
    }

    getConnectionType() {
        if (Homey.app.settings.connection_type) {
            return Homey.app.settings.connection_type
        }
        if (Homey.app.settings.use_mqtt === true) {
            return connTypeMQTT
        }
        return connTypeRPC
    }

    initializeBridge(bridge) {
        let self = this;
        let connType = self.getConnectionType()
        self.logmodule.log('info', 'Connection type:', connType)
        switch (connType) {
            case connTypeRPC:
                self.logmodule.log('info', "Initializing RPC CCU");
                self.bridges[bridge.serial] = new HomeMaticCCURPC(bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeMQTT:
                self.logmodule.log('info', "Initializing MQTT CCU ");
                self.bridges[bridge.serial] = new HomeMaticCCUMQTT(bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeCCUJack:
                self.logmodule.log('info', "Initializing CCU Jack");
                self.bridges[bridge.serial] = new HomeMaticCCUJack(
                    bridge.type,
                    bridge.serial,
                    bridge.address,
                    Homey.app.settings.ccu_jack_mqtt_port,
                    Homey.app.settings.ccu_jack_user,
                    Homey.app.settings.ccu_jack_password,
                );
                break;
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
