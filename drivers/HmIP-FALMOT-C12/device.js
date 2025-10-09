'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "homematic_measure_valve": {
                "channel": idx + 1,
                "key": "LEVEL",
                "convert": Convert.floatToPercent
            }
        }
        super.onInit(capabilityMap);
    }
}

module.exports = HomematicDevice;
