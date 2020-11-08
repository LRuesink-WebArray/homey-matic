'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "homematic_swsd_state": {
        "channel": 1,
        "key": "SMOKE_DETECTOR_ALARM_STATUS",
        "valueType": "string"
    },
    "homematic_swsd_alarm_button": {
        "set": {
            "channel": 1,
            "key": "SMOKE_DETECTOR_EVENT",
            "convert": () => {
                return 0
            }
        }
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOWBAT",
        "valueType": "boolean"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-SMOKE_DETECTOR_ALARM_STATUS', (value) => {
            self.driver.triggerStateChangedFlow(self, { "state": value }, { "state": value })
        });

    }
}

module.exports = HomematicDevice;
