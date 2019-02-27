'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff.relay1','onoff.relay2'
        ]
        this.homematicType = 'HM-LC-Sw2-FM'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;