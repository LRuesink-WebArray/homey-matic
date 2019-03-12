'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff": {
        "channel": 1,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 3
        }
    },
    "measure_power": {
        "channel": 2,
        "key": "POWER"
    },
    "measure_voltage": {
        "channel": 2,
        "key": "VOLTAGE"
    },
    "measure_current": {
        "channel": 2,
        "key": "CURRENT",
        "valueType": "mA"
    },
    "meter_power": {
        "channel": 2,
        "key": "ENERGY_COUNTER",
        "valueType": "Wh"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
