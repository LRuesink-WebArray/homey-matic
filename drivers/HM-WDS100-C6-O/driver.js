'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'measure_humidity',
            'meter_rain',
            'alarm_homematic_rain',
            'measure_wind_strength',
            'measure_wind_angle',
            'measure_luminance',
            'measure_homematic_sunshineduration'
        ]
        this.homematicTypes = ['HM-WDS100-C6-O'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;