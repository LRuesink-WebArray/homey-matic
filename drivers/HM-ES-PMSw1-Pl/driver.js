'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'measure_power',
            'measure_voltage',
            'measure_current',
            'meter_power'
        ]
        this.homematicType = 'HM-ES-PMSw1-Pl'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;