'use strict';

const Homey = require('homey');
const HomeMaticDiscovery = require('./lib/HomeMaticDiscovery');
const HomeMaticCCUMQTT = require('./lib/HomeMaticCCUMQTT');
const HomeMaticCCURPC = require('./lib/HomeMaticCCURPC');
const HomeMaticCCUJack = require('./lib/HomeMaticCCUJack');
const Constants = require('./lib/constants');
const Logger = require('./lib/logger');

const connTypeRPC = 'use_rpc';
const connTypeMQTT = 'use_mqtt';
const connTypeCCUJack = 'use_ccu_jack';

class Homematic extends Homey.App {

    async onInit() {
        this.logger = new Logger(this.homey);
        this.logger.log('info', 'Started homematic...');

        const address = await this.homey.cloud.getLocalAddress();
        this.homeyIP = address.split(':')[0];
        this.settings = this.getSettings();
        this.discovery = new HomeMaticDiscovery(this.logger, this.homey);
        this.bridges = {};

        if (this.settings.use_stored_bridges) {
            this.logger.log('info', 'Initializing stored bridges...');
            this.initializeStoredBridges();
        } else {
            this.logger.log('info', 'Starting discovery process...');
            await this.discovery.discover();
            this.logger.log('info', 'Discovery process finished.');
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
        };
    }

    getStoredBridges() {
        const bridges = {};
        this.homey.settings.getKeys().forEach((key) => {
            if (key.startsWith(Constants.SETTINGS_PREFIX_BRIDGE)) {
                const bridge = this.homey.settings.get(key);
                bridges[bridge.serial] = bridge;
            }
        });
        return bridges;
    }

    initializeStoredBridges() {
        const bridges = this.getStoredBridges();
        Object.keys(bridges).forEach((serial) => {
            const bridge = bridges[serial];
            this.logger.log('info', "Initializing stored CCU:", "Type", bridge.type, "Serial", bridge.serial, "IP", bridge.address);
            this.initializeBridge(bridge);
        });
    }

    getConnectionType() {
        if (this.settings.connection_type) {
            return this.settings.connection_type;
        }
        if (this.settings.use_mqtt) {
            return connTypeMQTT;
        }
        return connTypeRPC;
    }

    initializeBridge(bridge) {
        const connType = this.getConnectionType();
        this.logger.log('info', 'Connection type:', connType);
        switch (connType) {
            case connTypeRPC:
                this.logger.log('info', "Initializing RPC CCU");
                this.bridges[bridge.serial] = new HomeMaticCCURPC(this.logger, this.homey, bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeMQTT:
                this.logger.log('info', "Initializing MQTT CCU");
                this.bridges[bridge.serial] = new HomeMaticCCUMQTT(this.logger, this.homey, bridge.type, bridge.serial, bridge.address);
                break;
            case connTypeCCUJack:
                this.logger.log('info', "Initializing CCU Jack");
                this.bridges[bridge.serial] = new HomeMaticCCUJack(
                    this.logger,
                    this.homey,
                    bridge.type,
                    bridge.serial,
                    bridge.address,
                    this.settings.ccu_jack_mqtt_port,
                    this.settings.ccu_jack_user,
                    this.settings.ccu_jack_password,
                );
                break;
        }
        return this.bridges[bridge.serial];
    }

    setBridgeAddress(serial, address) {
        if (this.bridges[serial]) {
            this.bridges[serial].address = address;
        } else {
            this.logger.log('error', `No bridge found for serial: ${serial}`);
        }
    }

    deleteStoredBridges() {
        const bridges = this.getStoredBridges();
        Object.keys(bridges).forEach((serial) => {
            this.homey.settings.unset(Constants.SETTINGS_PREFIX_BRIDGE + serial);
        });
    }

    getLogLines() {
        return this.logger.getLogLines();
    }

}

module.exports = Homematic;
