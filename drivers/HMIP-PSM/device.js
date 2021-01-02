'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert')

const convertCurrent = function (value) {
    console.log("HMIP-PSM raw current:", value)
    let convertedValue = parseFloat(value) / 1000
    console.log("HMIP-PSM converted current:", convertedValue)
    return convertedValue
}

const capabilityMap = {
    "onoff": {
        "channel": 3,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 3
        }
    },
    "measure_power": {
        "channel": 6,
        "key": "POWER"
    },
    "measure_voltage": {
        "channel": 6,
        "key": "VOLTAGE"
    },
    "measure_current": {
        "channel": 6,
        "key": "CURRENT",
        "convert": convertCurrent
    },
    "meter_power": {
        "channel": 6,
        "key": "ENERGY_COUNTER",
        "convert": Convert.WhToKWh
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
