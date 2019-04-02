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
            "valueType": "keymatic_swap"
        }
    },
    "alarm_battery": {
        "channel": 1,
        "key": "LOWBAT",
        "valueType": "boolean"
    },
    "homematic_keymatic_open": {
        "channel": 1,
        "key": "OPEN",
        "valueType": "keymatic",
        "set": {
            "key": "STATE",
            "channel": 1,
            "valueType": "keymatic"
        }
    },
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
