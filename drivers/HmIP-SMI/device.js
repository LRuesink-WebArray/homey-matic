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
        "key": "ILLUMINATION",
        "valueType": "float"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
