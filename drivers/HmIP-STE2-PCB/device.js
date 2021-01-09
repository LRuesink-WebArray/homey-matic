'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "measure_temperature": {
                "channel": idx + 1,
                "key": "ACTUAL_TEMPERATURE"
            },
            "alarm_battery": {
                "channel": 0,
                "key": "LOW_BAT",
                "convert": Convert.toBoolean()
            }
        }
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
