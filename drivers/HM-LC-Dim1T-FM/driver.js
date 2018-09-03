'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'dim'
        ]
        this.homematicType = 'HM-LC-Dim1T-FM'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;