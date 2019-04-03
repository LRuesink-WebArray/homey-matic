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
            'homematic_thermostat_boost',
            'measure_battery',
            'measure_humidity'
        ]
        this.homematicTypes = ['HM-TC-IT-WM-W-EU'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;