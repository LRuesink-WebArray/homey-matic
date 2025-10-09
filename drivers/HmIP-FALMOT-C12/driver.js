'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'homematic_measure_valve'
        ]
        this.homematicTypes = ['HmIP-FALMOT-C12'];
        this.numDevices = 12
        this.multiDevice = true
        this.log(this.homematicTypes.join(','), 'has been inited');
    }

}

module.exports = HomematicDriver;
