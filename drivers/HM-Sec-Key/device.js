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
    "button": {
        "channel": 1,
        "key": "OPEN",
        "valueType": "keymatic",
        "set": {
            "key": "OPEN",
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
