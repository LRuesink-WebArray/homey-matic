'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "TEMPERATURE"
    },
    "measure_humidity": {
        "channel": 1,
        "key": "HUMIDITY"
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOWBAT"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
