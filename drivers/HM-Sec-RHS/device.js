'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const capabilityMap = {
    "homematic_rhs_state": {
        "channel": 1,
        "key": "STATE",
        "valueType": "string"
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

    initializeExtraEventListeners() {
        var self = this;
        self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-STATE', (value) => {
            self.driver.triggerStateChangedFlow(self, { "state": value }, { "state": value })
        });

    }
}

module.exports = HomematicDevice;
