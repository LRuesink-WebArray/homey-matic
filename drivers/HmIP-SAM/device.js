'use strict';

const Homey = require('homey');
const Device = require('../../lib/device')
const Convert = require('../../lib/convert')

const toBoolean = function (value) {
    console.log("HmIP-SAM value:", JSON.stringify(value))
    if (value === 0) {
        return false
    }
    return true
}

const capabilityMap = {
    "alarm_motion": {
        "channel": 1,
        "key": "MOTION",
        "convert": toBoolean
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
