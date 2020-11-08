'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-PRESS_SHORT', (value) => {
            self.driver.triggerButtonPressedFlow(self, { "button": 1 }, { "button": 1, "pressType": "short" })
        });
    }
}

module.exports = HomematicDevice;
