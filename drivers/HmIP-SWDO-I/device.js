'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "alarm_contact": {
        "channel": 1,
        "key": "STATE",
        "valueType": "boolean"
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOW_BAT",
        "valueType": "boolean"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
