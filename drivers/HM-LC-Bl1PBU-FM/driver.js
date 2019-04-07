'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            "windowcoverings_state",
            "windowcoverings_set"
        ];
        this.homematicTypes = ['HM-LC-Bl1PBU-FM'];
        this.log(this.homematicTypes.join(','), 'has been inited');
    }
}

module.exports = HomematicDriver;