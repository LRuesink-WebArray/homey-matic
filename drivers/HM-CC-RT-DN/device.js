'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 4,
        "key": "ACTUAL_TEMPERATURE",
        "valueType": "float"
    },
    "homematic_thermostat_boost": {
        "channel": 4,
        "key": "BOOST_STATE",
        "convert": Convert.toBoolean,
        "set": {
            "key": "BOOST_MODE",
            "channel": 4
        }
    },
    "target_temperature": {
        "channel": 4,
        "key": "SET_TEMPERATURE",
        "set": {
            "key": "SET_TEMPERATURE",
            "channel": 4,
            "convert": Convert.tofix,
            "convertMQTT": Convert.toFloat
        }
    },
    "homematic_thermostat_mode": {
        "channel": 4,
        "key": "CONTROL_MODE",
        "valueType": "string",
        "set": {
            "key": "CONTROL_MODE",
            "channel": 4,
            "valueType": "int"
        }
    },
    "homematic_measure_valve": {
        "channel": 4,
        "key": "VALVE_STATE",
        "valueType": "float"
    },
    "alarm_battery": {
        "channel": 4,
        "key": "FAULT_REPORTING",
        "convert": Convert.faultLowbatToBoolean
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
