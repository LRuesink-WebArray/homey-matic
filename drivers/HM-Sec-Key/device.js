'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "locked": {
        "channel": 1,
        "key": "STATE",
        "valueType": "keymatic_swap",
        "set": {
            "key": "STATE",
            "channel": 1,
            "valueType": "boolean"
        }
    },
    "alarm_battery": {
        "channel": 1,
        "key": "LOWBAT",
        "valueType": "boolean"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
