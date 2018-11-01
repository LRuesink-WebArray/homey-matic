'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'measure_power',
            'meter_power'
        ]
        this.homematicType = 'HMIP-PSM'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;