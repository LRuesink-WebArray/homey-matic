'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "onoff": {
                "channel": 3,
                "key": "ZONE_" + (idx+1) + "ACTIVE",
                "set": {
                    "key": "ZONE_" + (idx+1) + "ACTIVE",
                    "channel": 3
                }
            },
            "alarm_battery": {
                "channel": 1,
                "key": "LOWBAT",
                "convert": Convert.toBoolean
            }
        }
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
