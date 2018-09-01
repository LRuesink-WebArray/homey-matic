'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'measure_humidity'
        ]
        this.homematicType = 'HM-WS550STH-I'
        this.log('HM-WS550STH-I has been inited');
    }


}

module.exports = HomematicDriver;
