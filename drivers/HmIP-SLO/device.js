'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_luminance": {
        "channel": 1,
        "key": "CURRENT_ILLUMINATION",
        "valueType": "float"
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
