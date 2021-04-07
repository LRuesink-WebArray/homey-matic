'use strict';

const Device = require('../../lib/device.js')

class HomematicDevice extends Device {

    onInit() {
        var capabilityMap = {
            "onoff": {
                "channel": 2,
                "key": "LEVEL",
                "convert": this.convertGetOnOff,
                "set": {
                    "key": "LEVEL",
                    "channel": 2,
                    "convert": this.convertSetOnOff
                }
            },
            "dim": {
                "channel": 2,
                "key": "LEVEL",
                "set": {
                    "key": "LEVEL",
                    "channel": 2
                }
            }
        }
        super.onInit(capabilityMap);

        this.setCapabilityOptions("dim",{
            "setOnDim": false
        })
    }

    convertSetOnOff(value) {
        if (value === true) {
            return 1
        }
        return 0
    }

    convertGetOnOff(value) {
        return value > 0;
    }
}

module.exports = HomematicDevice;
