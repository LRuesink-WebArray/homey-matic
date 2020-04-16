'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "homematic_led_status": {
                "channel": idx + 1,
                "key": "LED_STATUS",
                "set": {
                    "key": "LED_STATUS",
                    "channel": idx + 1
                }
            }
        }
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        let idx = this.getData().attributes.Index;
        let button = idx+1;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
            self.driver.triggerButtonPressedFlow(self, {"button": button}, {"button": button, "pressType": "short"})
        });
    }

}

module.exports = HomematicDevice;
