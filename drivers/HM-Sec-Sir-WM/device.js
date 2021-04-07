'use strict';

const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "alarm_tamper": {
                "channel": idx + 1,
                "key": "ERROR_SABOTAGE",
                "convert": Convert.toBoolean
            },
            "onoff": {
                "channel": idx + 1,
                "key": "STATE",
                "set": {
                    "key": "STATE",
                    "channel": idx + 1
                }
            },
            "homematic_sec_sir_hm_armstate": {
                "channel": 4,
                "key": "ARMSTATE",
                "convert": Convert.toString,
                "set": {
                    "key": "ARMSTATE",
                    "channel": 4,
                    "convert": Convert.toInt
                }
            },
            "alarm_battery": {
                "channel": 1,
                "key": "LOWBAT"
            }
        }
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
