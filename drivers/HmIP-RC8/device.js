'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js');

const capabilityMap = {}

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        for (let button = 1; button <= 8; button++) {
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
