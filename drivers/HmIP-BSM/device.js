'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "onoff": {
        "channel": 4,
        "key": "STATE",
        "set": {
            "key": "STATE",
            "channel": 4
        }
    },
    "measure_power": {
        "channel": 7,
        "key": "POWER"
    },
    "measure_voltage": {
        "channel": 7,
        "key": "VOLTAGE"
    },
    "measure_current": {
        "channel": 7,
        "key": "CURRENT",
        "valueType": "mA"
    },
    "meter_power": {
        "channel": 7,
        "key": "ENERGY_COUNTER",
        "valueType": "Wh"
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
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }

    }
}

module.exports = HomematicDevice;
