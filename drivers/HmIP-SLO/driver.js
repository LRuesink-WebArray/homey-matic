'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_luminance',
            'alarm_battery'
        ];
        this.homematicTypes = ['HmIP-SLO'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        
    }

    
}

module.exports = HomematicDriver;
