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
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-PRESS', (value) => {
            self.driver.triggerButtonPressedFlow1(self, {}, 1)
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':2-PRESS', (value) => {
            self.driver.triggerButtonPressedFlow2(self, {}, 2)
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':3-PRESS', (value) => {
            self.driver.triggerButtonPressedFlow3(self, {}, 3)
        });

        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-INSTALL_TEST', (value) => {
            self.driver.triggerButtonPressedFlow1(self, {}, 1)
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':2-INSTALL_TEST', (value) => {
            self.driver.triggerButtonPressedFlow2(self, {}, 2)
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':3-INSTALL_TEST', (value) => {
            self.driver.triggerButtonPressedFlow3(self, {}, 3)
        });
        var self = this;
    }
}

module.exports = HomematicDevice;