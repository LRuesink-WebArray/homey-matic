'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

{{ if .Capabilities -}}
const capabilityMap = {
    {{- range initial .Capabilities }}
    "{{.}}": {
        "channel": 1,
        "key": "STATE",
        "valueType": "boolean"
    },
    {{- end }}
    "{{last .Capabilities}}": {
        "channel": 1,
        "key": "STATE",
        "valueType": "boolean"
    }
}
{{- else }}
const capabilityMap = {}
{{- end }}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

{{- if ne .NumberButtons 0 }}

    initializeExtraEventListeners() {
        var self = this;
        for (let button = 1; button <= {{ .NumberButtons }}; button++) {
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_SHORT', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "short" })
            });
            self.bridge.on('event-' + self.HomeyInterfaceName + '-' + self.deviceAddress + ':' + button + '-PRESS_LONG', (value) => {
                self.driver.triggerButtonPressedFlow(self, { "button": button }, { "button": button, "pressType": "long" })
            });
        }
    }
{{- end }}

}

module.exports = HomematicDevice;
