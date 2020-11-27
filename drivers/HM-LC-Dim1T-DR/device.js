'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff": {
        "channel": 1,
        "key": "LEVEL",
        "valueType": "onOffDimGet",
        "set": {
            "key": "LEVEL",
            "channel": 1,
            "valueType": "onOffDimSet"
        }
    },
    "dim": {
        "channel": 1,
        "key": "LEVEL",
        "set": {
            "key": "LEVEL",
            "channel": 1
        }
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);

        this.setCapabilityOptions("dim",{
            "setOnDim": false
        })
    }
}

module.exports = HomematicDevice;
