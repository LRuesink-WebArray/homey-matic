'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "alarm_motion": {
        "channel": 1,
        "key": "MOTION",
        "valueType": "boolean"
    },
    "measure_luminance": {
        "channel": 1,
        "key": "BRIGHTNESS",
        "valueType": "float"
    },
    "alarm_battery": {
        "channel": 0,
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
