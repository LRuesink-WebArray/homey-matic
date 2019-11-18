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
        ];
        this.homematicTypes = ['HM-ES-PMSw1-Pl', 'HM-ES-PMSw1-Pl-DN-R5', 'HM-ES-PMSw1-DR'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;