'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const convertLuminance = function (value) {
    console.log("HmIP-SLO raw luminance:", value)
    let convertedValue = parseFloat(value)
    console.log("HmIP-SLO converted luminance:", convertedValue)
    return convertedValue
}

const capabilityMap = {
    "measure_luminance.current": {
        "channel": 1,
        "key": "CURRENT_ILLUMINATION",
        "convert": convertLuminance
    },
    "measure_luminance.average": {
        "channel": 1,
        "key": "AVERAGE_ILLUMINATION",
        "convert": convertLuminance
    },
    "measure_luminance.highest": {
        "channel": 1,
        "key": "HIGHEST_ILLUMINATION",
        "convert": convertLuminance
    },
    "measure_luminance.lowest": {
        "channel": 1,
        "key": "LOWEST_ILLUMINATION",
        "convert": convertLuminance
    },
    "alarm_battery": {
        "channel": 0,
        "key": "LOW_BAT",
        "valueType": "boolean"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-CURRENT_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerCurrentIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-AVERAGE_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerAverageIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-HIGHEST_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerHighestIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-LOWEST_ILLUMINATION', (value) => {
            let val = Convert.toFloat(value)
            self.driver.triggerLowestIlluminanceChangedFlow(self, {"Illuminance": val}, {})
        });
    }
}

module.exports = HomematicDevice;
