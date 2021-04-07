'use strict';

const Device = require('../../lib/device.js')

class HomematicDevice extends Device {

    onInit() {
        var capabilityMap = {
            "onoff": {
                "channel": 4,
                "key": "LEVEL",
                "convert": this.convertGetOnOff,
                "set": {
                    "key": "LEVEL",
                    "channel": 4,
                    "convert": this.convertSetOnOff
                }
            },
            "dim": {
                "channel": 4,
                "key": "LEVEL",
                "set": {
                    "key": "LEVEL",
                    "channel": 4
                }
            }
        }
        super.onInit(capabilityMap);

        this.setCapabilityOptions("dim",{
            "setOnDim": false
        })
    }

    initializeExtraEventListeners() {
        var self = this;
        for (let button = 1; button <= 2; button++) {
            self.bridge.on('event-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            self.bridge.on('event-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }
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
