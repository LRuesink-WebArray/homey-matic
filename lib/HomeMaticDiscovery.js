'use strict';

const dgram = require('dgram');
const HomeMaticCCUMQTT = require('./HomeMaticCCUMQTT');
const HomeMaticCCURPC = require('./HomeMaticCCURPC');
const Homey = require('homey');
const Constants = require('./constants')

const DISCOVER_MESSAGE = Buffer.from([0x02, 0x8F, 0x91, 0xC0, 0x01, 'e', 'Q', '3', 0x2D, 0x2A, 0x00, 0x2A, 0x00, 0x49]);
const DISCOVER_TIMEOUT = 2000;
const CCU_PORT = 43439;
const DGRAM_PORT = 48724;

module.exports = class HomeMaticDiscovery {

  constructor() {
    this.log = Homey.app.logmodule.log;
    this.devices = {};
  }

  _onClientMessage(message, remote) {
    var self = this;
    const {
      address,
    } = remote;

    const headerStart = 0;
    const headerEnd = 5;
    const header = message.slice(headerStart, headerEnd);

    const typeStart = headerEnd;
    const typeEnd = message.indexOf(0x00);
    const type = message.slice(typeStart, typeEnd).toString();

    const serialStart = typeEnd + 1;
    const serialEnd = serialStart + message.slice(serialStart).indexOf(0x00);
    const serial = message.slice(serialStart, serialEnd).toString();

    //if (this.devices[serial]) {
    if (Homey.app.bridges[serial]) {
      //this.devices[serial].address = address;
      Homey.app.setBridgeAddress(serial, address)
    } else {
      Homey.app.initializeBridge({serial: serial, type: type, address: address})
      // if (Homey.app.settings.use_mqtt == true) {
      //   self.log('info', "Initializing MQTT CCU");
      //   this.devices[serial] = new HomeMaticCCUMQTT(type, serial, address);
      // } else {
      //   self.log('info', "Initializing RPC CCU");
      //   this.devices[serial] = new HomeMaticCCURPC(type, serial, address);
      // }
    }
    Homey.ManagerSettings.set(Constants.SETTINGS_PREFIX_BRIDGE + serial, {serial: serial, type: type, address: address})
  }

  async getClient() {
    if (!this._client) {
      this._client = new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        client.on('message', this._onClientMessage.bind(this));
        client.bind(48724, err => {
          if (err) return reject(err);
          client.setBroadcast(true);
          resolve(client);
        });
      });
    }

    return this._client;
  }

  async discover({ timeout = DISCOVER_TIMEOUT } = {}) {
    const client = await this.getClient();
    client.send(DISCOVER_MESSAGE, 0, DISCOVER_MESSAGE.length, CCU_PORT, '255.255.255.255');
    await new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
    //return this.devices;
  }

}