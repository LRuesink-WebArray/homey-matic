'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'alarm_water'
        ]
        this.homematicType = 'HmIP-SWD'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;