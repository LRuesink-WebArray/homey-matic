'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        {{- if .Capabilities }}
        this.capabilities = [
            {{- range initial .Capabilities }}
            '{{ . }}',
            {{- end }}
        {{- if last .Capabilities }}
            '{{ last .Capabilities }}'
        {{- end }}
        ];
        {{- else }}
        this.capabilities = []
        {{- end }}
        this.homematicTypes = ['{{ .DriverName }}'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        {{ if ne .NumberButtons 0 -}}
        this._flowTriggerButtonPressed = new Homey.FlowCardTriggerDevice('{{ .DriverName }}-press')
            .register()
            .registerRunListener((args, state) => {
                if (args.button == state.button && args.pressType == state.pressType) {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject(false)
                }
            })
        {{- end }}
    }

    {{ if ne .NumberButtons 0 -}}
    triggerButtonPressedFlow(device, tokens, state) {
        this._flowTriggerButtonPressed
            .trigger(device, tokens, state)
            .catch(this.error)
    }
    {{- end }}
}

module.exports = HomematicDriver;
