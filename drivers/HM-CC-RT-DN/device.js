'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "ACTUAL_TEMPERATURE",
        "valueType": "old_temp_get"
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
        "key": "SET_TEMPERATURE",
        "valueType": "float",
        "set": {
            "key": "SET_TEMPERATURE",
            "channel": 1,
            "valueType": "old_temp_set"
        }
    },
    "homematic_thermostat_mode": {
        "channel": 1,
        "key": "CONTROL_MODE",
        "valueType": "string",
        "set": {
            "key": "CONTROL_MODE",
            "channel": 1,
            "valueType": "int"
        }
    },
    "homematic_measure_valve": {
        "channel": 1,
        "key": "VALVE_STATE",
        "valueType": "float"
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
