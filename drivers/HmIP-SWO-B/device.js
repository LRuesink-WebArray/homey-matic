'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "ACTUAL_TEMPERATURE"
    },
    "measure_humidity": {
        "channel": 1,
        "key": "HUMIDITY",
        "convert": Convert.toFloat
    },
    "	measure_wind_strength": {
        "channel": 1,
        "key": "WIND_SPEED",
        "convert": Convert.toFloat
    },
    "measure_luminance": {
        "channel": 1,
        "key": "ILLUMINATION",
        "convert": Convert.toInt
    },
    "measure_homematic_sunshineduration": {
        "channel": 1,
        "key": "SUNSHINEDURATION",
        "convert": Convert.toInt
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
