'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff": {
        "channel": 3,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 3
        }
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
