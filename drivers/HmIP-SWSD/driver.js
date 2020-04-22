'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'homematic_swsd_state',
            'homematic_swsd_alarm_button',
            'alarm_battery'
        ];
        this.homematicTypes = ['HmIP-SWSD'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerStateChanged = new Homey.FlowCardTriggerDevice('HmIP-SWSD-changed')
            .register()
            .registerRunListener((args, state) => {
                if (args.state == state.state) {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject(false)
                }
            })
        
    }

    triggerStateChangedFlow(device, tokens, state) {
        this._flowTriggerStateChanged
            .trigger(device, tokens, state)
            .catch((res, err) => { console.log(err) })
    }

}

module.exports = HomematicDriver;
