'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "ACTUAL_TEMPERATURE"
    },
    "homematic_thermostat_boost": {
        "channel": 1,
        "key": "BOOST_STATE",
        "set": {
            "key": "BOOST_MODE",
            "channel": 1
        }
    },
    "target_temperature": {
        "channel": 1,
        "key": "SET_TEMPERATURE",
        "set": {
            "key": "SET_TEMPERATURE",
            "channel": 1
        }
    },
    "measure_battery": {
        "channel": 1,
        "key": "BATTERY_STATE",
        "valueType": "float"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
