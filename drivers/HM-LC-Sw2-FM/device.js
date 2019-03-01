'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff.relay1": {
        "channel": 1,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 1
        }
    },
    "onoff.relay2": {
        "channel": 2,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 2
        }
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
