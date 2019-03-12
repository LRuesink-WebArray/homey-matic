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
        this._driver = this.getDriver();
        var self = this;
        this.driver.getBridge({ serial: this.bridgeSerial })
            .then(async bridge => {
                self.bridge = bridge;
                self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':1-STATE', (value) => {
                    self._driver.triggerStateChangedFlow(self, { "state": value }, { "state": value })
                });
            }).catch(err => {
                this.error(err);
            });
    }
}

module.exports = HomematicDevice;
