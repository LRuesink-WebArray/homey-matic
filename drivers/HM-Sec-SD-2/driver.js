'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'alarm_smoke', 'alarm_battery'
        ]
        this.homematicType = 'HM-Sec-SD-2'
        this.log(this.homematicType, 'has been inited');
    }


}

module.exports = HomematicDriver;