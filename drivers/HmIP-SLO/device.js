'use strict';

const Convert = require('../../lib/convert');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "measure_luminance.current": {
        "channel": 1,
        "key": "CURRENT_ILLUMINATION",
        "convert": Convert.toFloat
    },
    "measure_luminance.average": {
        "channel": 1,
        "key": "AVERAGE_ILLUMINATION",
        "convert": Convert.toFloat
    },
    "measure_luminance.highest": {
        "channel": 1,
        "key": "HIGHEST_ILLUMINATION",
        "convert": Convert.toFloat
    },
    "measure_luminance.lowest": {
        "channel": 1,
        "key": "LOWEST_ILLUMINATION",
        "convert": Convert.toFloat
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOW_BAT",
        "convert": Convert.toBoolean
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        self.bridge.on('event-' + self.deviceAddress + ':1-CURRENT_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerCurrentIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.deviceAddress + ':1-AVERAGE_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerAverageIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.deviceAddress + ':1-HIGHEST_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerHighestIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.deviceAddress + ':1-LOWEST_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerLowestIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
    }
}

module.exports = HomematicDevice;
