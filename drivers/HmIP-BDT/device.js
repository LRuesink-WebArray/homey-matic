'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

class HomematicDevice extends Device {

    onInit() {
        this.mylog = Homey.app.logmodule.log;
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

    convertSetOnOff(value) {
        if (value === true) {
            return 1
        }
        return 0
    }

    convertGetOnOff(value) {
        Homey.app.logmodule.log('info', 'HmIP-BDT: Got level', value)
        return value > 0;
    }
}

module.exports = HomematicDevice;
