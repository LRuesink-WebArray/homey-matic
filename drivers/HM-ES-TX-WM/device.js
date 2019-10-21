'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_power": {
        "channel": 1,
        "key": "POWER"
    },
    "meter_power": {
        "channel": 1,
        "key": "ENERGY_COUNTER"
    },
    "measure_homematic_gas_power": {
        "channel": 1,
        "key": "GAS_POWER"
    },
    "meter_gas": {
        "channel": 1,
        "key": "GAS_ENERGY_COUNTER"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
