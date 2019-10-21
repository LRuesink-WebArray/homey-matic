'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

const capabilityMap = {
    "measure_temperature": {
        "channel": 1,
        "key": "TEMPERATURE"
    },
    "homematic_thermostat_boost": {
        "channel": 2,
        "key": "BOOST_STATE",
        "convert": Convert.toBoolean,
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
            "convert": Convert.tofix,
            "convertMQTT": Convert.toFloat
        }
    },
    "alarm_battery": {
        "channel": 2,
        "key": "LOWBAT_REPORTING"
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
