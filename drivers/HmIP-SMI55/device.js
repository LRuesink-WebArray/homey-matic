'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js');
const Convert = require('../../lib/convert.js');

const capabilityMap = {
    "alarm_motion": {
        "channel": 1,
        "key": "MOTION",
        "convert": Convert.toBoolean
    },
    "measure_luminance": {
        "channel": 1,
        "key": "ILLUMINATION",
        "convert": Convert.toFloat()
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOW_BAT",
        "convert": Convert.toBoolean
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
