'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

class HomematicDevice extends Device {

    onInit() {
        var idx = this.getData().attributes.Index;
        var capabilityMap = {
            "homematic_led_status": {
                "channel": idx + 1,
                "key": "LED_STATUS",
                "convert": Convert.toString,
                "set": {
                    "key": "LED_STATUS",
                    "channel": idx + 1,
                    "convert": Convert.toInt
                }
            }
        }
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        let idx = this.getData().attributes.Index;
        let channel = idx+1;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + channel + '-PRESS_SHORT', (value) => {
            self.driver.triggerButtonPressedFlow(self, {"button": 1}, {"button": 1, "pressType": "short"})
        });
    }

}

module.exports = HomematicDevice;
