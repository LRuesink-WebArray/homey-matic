'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff'
        ]
        this.homematicTypes = ['HM-LC-Sw4-DR', 'HM-LC-Sw4-DR-2']
        this.numDevices = 4
        this.multiDevice = true
        this.log(this.homematicTypes.join(','), 'has been inited');
    }


}

module.exports = HomematicDriver;