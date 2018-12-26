'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
        this._driver = this.getDriver();
        var self = this;
        for (let button = 1; button <= 6; button++) {
            Homey.app.hm.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            Homey.app.hm.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self._driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }
    }
}

module.exports = HomematicDevice;