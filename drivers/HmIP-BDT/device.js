'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff": {
        "channel": 4,
        "key": "LEVEL",
        "valueType": "onOffDimGet",
        "set": {
            "key": "LEVEL",
            "channel": 4,
            "valueType": "onOffDimSet"
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

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        for (let button = 1; button <= 2; button++) {
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }
    }

}

module.exports = HomematicDevice;