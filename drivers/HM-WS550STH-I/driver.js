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
        this.homematicTypes = ['HM-WS550STH-I'];
        this.log(this.homematicTypes.join(','), ' has been inited');
    }


}

module.exports = HomematicDriver;
