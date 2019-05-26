'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'measure_humidity',
            'target_temperature',
            'homematic_thermostat_mode',
            'homematic_thermostat_boost',
            'homematic_thermostat_weekprofile'
        ]
        this.homematicTypes = ['HmIP-STH'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;