'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')


class HomematicDevice extends Device {

    onInit() {
        let idx = this.getData().attributes.Index;

        let capabilityMap = {};
        if (idx === undefined) {
            capabilityMap = {
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
                },
            }
        } else if (idx === 0) {
            capabilityMap = {
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
                },
                "measure_homematic_iec_power": {
                    "channel": 1,
                    "key": "IEC_POWER"
                },
                "meter_homematic_iec_power": {
                    "channel": 1,
                    "key": "IEC_ENERGY_COUNTER"
                },
            }
        }else {
                capabilityMap = {
                    "measure_homematic_iec_power": {
                        "channel": 2,
                        "key": "IEC_POWER"
                    },
                    "meter_homematic_iec_power": {
                        "channel": 2,
                        "key": "IEC_ENERGY_COUNTER"
                    },
                }
        }

        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
