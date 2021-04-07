'use strict';

const Device = require('../../lib/device.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "alarm_contact": {
                "channel": idx + 1,
                "key": "STATE",
                "valueType": "boolean"
            },
            "alarm_battery": {
                "channel": idx + 1,
                "key": "LOWBAT",
                "valueType": "boolean"
            }
        }

        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
