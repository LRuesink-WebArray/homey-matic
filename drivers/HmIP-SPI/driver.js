'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'alarm_motion',
            'measure_luminance'
        ]
        this.homematicType = 'HmIP-SPI'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;