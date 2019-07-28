'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_power',
            'meter_power',
            'measure_homematic_gas_power',
            'meter_gas'
        ]
        this.homematicTypes = ['HM-ES-TX-WM'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;