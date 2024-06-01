'use strict';

const dgram = require('dgram');
const Constants = require('./constants');

const DISCOVER_MESSAGE = Buffer.from([0x02, 0x8F, 0x91, 0xC0, 0x01, 'e', 'Q', '3', 0x2D, 0x2A, 0x00, 0x2A, 0x00, 0x49]);
const DISCOVER_TIMEOUT = 5000; // Timeout for network delays
const CCU_PORT = 43439;
const DGRAM_PORT = 48724;

module.exports = class HomeMaticDiscovery {

  constructor(logger, homey) {
    this.logger = logger;
    this.homey = homey;
    this.devices = {};
    this.discoveryInProgress = false; // Flag to prevent multiple discovery processes
  }

  _onClientMessage(message, remote) {
    const { address, port } = remote;
    this.logger.log('info', `Received message from ${address}:${port}`);
    this.logger.log('info', `Raw message: ${message.toString('hex')}`);

    try {
      const headerStart = 0;
      const headerEnd = 5;
      const typeStart = headerEnd;
      const typeEnd = message.indexOf(0x00, typeStart);
      if (typeEnd === -1) throw new Error('Invalid message format: missing type');

      const type = message.slice(typeStart, typeEnd).toString();

      const serialStart = typeEnd + 1;
      const serialEnd = message.indexOf(0x00, serialStart);
      if (serialEnd === -1) throw new Error('Invalid message format: missing serial');

      const serial = message.slice(serialStart, serialEnd).toString();

      this.logger.log('info', `Discovered device - Type: ${type}, Serial: ${serial}, Address: ${address}`);

      if (this.homey.app.bridges[serial]) {
        this.logger.log('info', `Updating existing bridge: ${serial}`);
        this.homey.app.setBridgeAddress(serial, address);
      } else {
        this.logger.log('info', `Initializing new bridge: ${serial}`);
        this.homey.app.initializeBridge({ serial: serial, type: type, address: address });
      }
      this.homey.settings.set(Constants.SETTINGS_PREFIX_BRIDGE + serial, { serial: serial, type: type, address: address });
    } catch (err) {
      this.logger.log('error', `Error processing message from ${address}:`, err);
    }
  }

  async getClient() {
    if (!this._client) {
      this._client = new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');
        client.on('message', this._onClientMessage.bind(this));
        client.on('error', (err) => {
          this.logger.log('error', 'UDP client error:', err);
        });
        client.on('listening', () => {
          const address = client.address();
          this.logger.log('info', `UDP client listening on ${address.address}:${address.port}`);
        });
        client.bind(DGRAM_PORT, (err) => {
          if (err) {
            this.logger.log('error', 'Failed to bind UDP client:', err);
            return reject(err);
          }
          client.setBroadcast(true);
          resolve(client);
        });
      });
    }
    return this._client;
  }

  async discover({ timeout = DISCOVER_TIMEOUT } = {}) {
    if (this.discoveryInProgress) {
      this.logger.log('info', 'Discovery process already in progress...');
      return;
    }

    this.discoveryInProgress = true;
    this.logger.log('info', 'Starting discovery process...');
    
    try {
      const client = await this.getClient();
      client.send(DISCOVER_MESSAGE, 0, DISCOVER_MESSAGE.length, CCU_PORT, '255.255.255.255', (err) => {
        if (err) {
          this.logger.log('error', 'Failed to send discovery message:', err);
        } else {
          this.logger.log('info', 'Discovery message sent');
        }
      });
      await new Promise(resolve => setTimeout(resolve, timeout));
      this.logger.log('info', 'Discovery process completed');
    } catch (err) {
      this.logger.log('error', 'Discovery failed:', err);
    } finally {
      this.discoveryInProgress = false;
      this.logger.log('info', 'Discovery process finished.');
    }
  }
}
