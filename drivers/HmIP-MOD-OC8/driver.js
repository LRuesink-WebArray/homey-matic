'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {
    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff'
        ]
        this.homematicTypes = ['HmIP-MOD-OC8'];
        this.numDevices = 8
        this.multiDevice = true
        this.log(this.homematicTypes.join(','), 'has been inited');
    }

}

module.exports = HomematicDriver;