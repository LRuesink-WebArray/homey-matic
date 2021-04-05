'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'homematic_rhs_state'
        ]
        this.homematicTypes = ['HmIP-SRH']
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerStateChanged = this.homey.flow.getDeviceTriggerCard('HmIP-SRH-changed')
            .registerRunListener((args, state) => {
                // console.log(args.state + " " + state.state)
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