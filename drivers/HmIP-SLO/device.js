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
            self.driver.triggerCurrentIlluminanceChangedFlow(self, {"Illuminance": self.getCapabilityValue('measure_luminance.current')}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-AVERAGE_ILLUMINATION', (value) => {
            self.driver.triggerAverageIlluminanceChangedFlow(self, {"Illuminance": self.getCapabilityValue('measure_luminance.average')}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-HIGHEST_ILLUMINATION', (value) => {
            self.driver.triggerHighestIlluminanceChangedFlow(self, {"Illuminance": self.getCapabilityValue('measure_luminance.highest')}, {})
        });
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-LOWEST_ILLUMINATION', (value) => {
            self.driver.triggerLowestIlluminanceChangedFlow(self, {"Illuminance": self.getCapabilityValue('measure_luminance.lowest')}, {})
        });


    }
}

module.exports = HomematicDevice;
