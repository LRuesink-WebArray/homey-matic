'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'measure_humidity',
            'measure_wind_strength',
            'measure_luminance',
            'measure_homematic_sunshineduration'
        ]
        this.homematicTypes = ['HmIP-SWO-B'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;