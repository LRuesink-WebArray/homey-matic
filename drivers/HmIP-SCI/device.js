'use strict';

const Homey = require('homey');
const Device = require('../../lib/device')
const Convert = require('../../lib/convert')

const capabilityMap = {
    "alarm_contact": {
        "channel": 1,
        "key": "STATE",
        "convert": Convert.toBoolean
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOW_BAT",
        "convert": Convert.toBoolean
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
