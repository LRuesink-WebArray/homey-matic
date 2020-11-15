'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'alarm_battery'
        ]
        this.homematicTypes = ['HmIP-ASIR', 'HmIP-ASIR-2']
        this.numDevices = 7
        this.multiDevice = true
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;