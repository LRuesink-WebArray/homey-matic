'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {}

const buttons = {
    '48': 'AO',
    '16': 'AI',
    '112': 'BO',
    '80': 'BI',
    '55': 'AOBO',
    '21': 'AIBI',
    '53': 'AOBI',
    '23': 'AIBO'
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
        this._driver = this.getDriver();
    }

    initializeExtraEventListeners() {
        this.db0 = 0;
        this.active = false;
        var self = this;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-DB0', (value) => {
            if (value == '0') {
                self._driver.triggerButtonPressedFlow(self, { "button": buttons[self.db0] }, { "button": buttons[self.db0], "pressType": "released" })
            } else {
                this.active = true;
                self._driver.triggerButtonPressedFlow(self, { "button": buttons[value] }, { "button": buttons[value], "pressType": "down" })
            }
            self.db0 = value;
        });
        for (let button = 1; button <= 4; button++) {
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                if (this.db0 != '0') {
                    self._driver.triggerButtonPressedFlow(self, { "button": buttons[self.db0] }, { "button": buttons[self.db0], "pressType": "short" })
                    this.active = false;
                }
            });
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                if (this.active == true) {
                    self._driver.triggerButtonPressedFlow(self, { "button": buttons[self.db0] }, { "button": buttons[self.db0], "pressType": "long" })
                    this.active = false;
                }
            });
        }
    }
}

module.exports = HomematicDevice;