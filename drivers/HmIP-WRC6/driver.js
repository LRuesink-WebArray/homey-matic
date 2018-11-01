'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [];
        this.homematicType = 'HmIP-WRC6';
        this.log(this.homematicType, 'has been inited');

        this._flowTriggerButtonPressed = new Homey.FlowCardTriggerDevice('HmIP-WRC6-press')
            .register()
            .registerRunListener((args, state) => {
                if (args.button == state.button && args.pressType == state.pressType) {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject(false)
                }
            })

        this._flowTriggerButtonReleased = new Homey.FlowCardTriggerDevice('HmIP-WRC6-released')
            .register()
            .registerRunListener((args, state) => {
                if (args.button == state.button) {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject(false)
                }
            })
    }

    triggerButtonPressedFlow(device, tokens, state) {
        this._flowTriggerButtonPressed
            .trigger(device, tokens, state)
            .catch(this.error)
    }

    triggerButtonReleasedFlow(device, tokens, state) {
        this._flowTriggerButtonReleased
            .trigger(device, tokens, state)
            .catch(this.error)
    }

}

module.exports = HomematicDriver;