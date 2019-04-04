'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "TEMPERATURE"
    },
    "homematic_thermostat_boost": {
        "channel": 2,
        "key": "BOOST_STATE",
        "set": {
            "key": "BOOST_MODE",
            "channel": 2,
            "valueType": "boolean"
        }
    },
    "target_temperature": {
        "channel": 2,
        "key": "SET_TEMPERATURE",
        "set": {
            "key": "SET_TEMPERATURE",
            "channel": 2,
            "valueType": "fixed"
        }
    },
    "measure_battery": {
        "channel": 0,
        "key": "LOWBAT",
        "valueType": "boolean"
    },
    "measure_humidity": {
        "channel": 1,
        "key": "HUMIDITY",
        "valueType": "float"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
