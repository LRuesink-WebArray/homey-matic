'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "ACTUAL_TEMPERATURE"
    },
    "homematic_thermostat_boost": {
        "channel": 1,
        "key": "BOOST_MODE",
        "set": {
            "key": "BOOST_MODE",
            "channel": 1
        }
    },
    "target_temperature": {
        "channel": 1,
        "key": "SET_POINT_TEMPERATURE",
        "set": {
            "key": "SET_POINT_TEMPERATURE",
            "channel": 1
        }
    },
    "homematic_thermostat_mode": {
        "channel": 1,
        "key": "SET_POINT_MODE",
        "convert": Convert.toString,
        "set": {
            "key": "CONTROL_MODE",
            "channel": 1,
            "convert": Convert.toInt
        }
    },
    "homematic_thermostat_weekprofile": {
        "channel": 1,
        "key": "ACTIVE_PROFILE",
        "convert": Convert.toString,
        "set": {
            "key": "ACTIVE_PROFILE",
            "channel": 1,
            "convert": Convert.toInt
        }
    },
    "homematic_measure_valve": {
        "channel": 1,
        "key": "LEVEL",
        "convert": Convert.floatToPercent
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
