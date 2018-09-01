'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'target_temperature',
            'homematic_thermostat_mode',
            'homematic_thermostat_boost'
        ]
        this.homematicType = 'HmIP-eTRV-2'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;