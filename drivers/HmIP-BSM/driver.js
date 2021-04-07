'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'measure_power',
            'measure_voltage',
            'measure_current',
            'meter_power'
        ]
        this.homematicTypes = ['HmIP-BSM'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerButtonPressed = this.homey.flow.getDeviceTriggerCard('HmIP-BSM-press')
            .registerRunListener((args, state) => {
                if (args.button == state.button && args.pressType == state.pressType) {
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


}

module.exports = HomematicDriver;