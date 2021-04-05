'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const HomeMaticCCUMQTT = require('./lib/HomeMaticCCUMQTT');
const HomeMaticCCURPC = require('./lib/HomeMaticCCURPC');
const HomeMaticCCUJack = require('./lib/HomeMaticCCUJack');
const Constants = require('./lib/constants');
const Logger = require('./lib/logger')

const connTypeRPC = 'use_rpc'
const connTypeMQTT = 'use_mqtt'
const connTypeCCUJack = 'use_ccu_jack'

class Homematic extends Homey.App {

    async onInit() {
        this.logger = new Logger(this.homey);
        this.logger.log('info', 'Started homematic...');
        var self = this;
        let address = await this.homey.cloud.getLocalAddress()
        self.homeyIP = address.split(':')[0]
        self.settings = self.getSettings();
        self.discovery = new HomeMaticDiscovery(this.logger, this.homey);
        self.bridges = {};
        if (this.homey.app.settings.use_stored_bridges) {
            self.initializeStoredBridges();
        } else {
            await self.discovery.discover()
        }
    }

    getSettings() {
        return {
            "use_mqtt": this.homey.settings.get('use_mqtt'),
            "connection_type": this.homey.settings.get('connection_type'),
            "ccu_jack_mqtt_port": this.homey.settings.get('ccu_jack_mqtt_port'),
            "ccu_jack_user": this.homey.settings.get('ccu_jack_user'),
            "ccu_jack_password": this.homey.settings.get('ccu_jack_password'),
            "use_stored_bridges": this.homey.settings.get('use_stored_bridges'),
        }
    }

    getStoredBridges() {
        var self = this;
        var bridges = {};
        this.homey.settings.getKeys().forEach((key) => {
            if (key.startsWith(Constants.SETTINGS_PREFIX_BRIDGE)) {
                let bridge = this.homey.settings.get(key);
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
            self.logger.log('info', "Initializing stored ccu:", "Type", bridge.type, "Serial", bridge.serial, "IP", bridge.address);
            self.initializeBridge(bridge)
        });
    }

    getConnectionType() {
        if (this.homey.app.settings.connection_type) {
            return this.homey.app.settings.connection_type
        }
        if (this.homey.app.settings.use_mqtt === true) {
            return connTypeMQTT
        }
        return connTypeRPC
    }

    initializeBridge(bridge) {
        let self = this;
        let connType = self.getConnectionType()
        self.logger.log('info', 'Connection type:', connType)
        switch (connType) {
            case connTypeRPC:
                self.logger.log('info', "Initializing RPC CCU");
                self.bridges[bridge.serial] = new HomeMaticCCURPC(self.logger, self.homey, bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeMQTT:
                self.logger.log('info', "Initializing MQTT CCU ");
                self.bridges[bridge.serial] = new HomeMaticCCUMQTT(self.logger, self.homey, bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeCCUJack:
                self.logger.log('info', "Initializing CCU Jack");
                self.bridges[bridge.serial] = new HomeMaticCCUJack(
                    self.logger,
                    self.homey,
                    bridge.type,
                    bridge.serial,
                    bridge.address,
                    this.homey.app.settings.ccu_jack_mqtt_port,
                    this.homey.app.settings.ccu_jack_user,
                    this.homey.app.settings.ccu_jack_password,
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
            this.homey.settings.unset(Constants.SETTINGS_PREFIX_BRIDGE + serial)
        })
    }

    getLogLines() {
        return this.logger.getLogLines();
    }

}


module.exports = Homematic;
