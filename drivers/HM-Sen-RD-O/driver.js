'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'homematic_rhs_state'
        ]
        this.homematicTypes = ['HM-Sen-RD-O']
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerTurnedOn = new Homey.FlowCardTriggerDevice('HM-Sen-RD-O-turned-on')
            .register()

        this._flowTriggerTurnedOff = new Homey.FlowCardTriggerDevice('HM-Sen-RD-O-turned-off')
            .register()
    }

    triggerTurnedOn(device, tokens, state) {
        this._flowTriggerTurnedOn
            .trigger(device, tokens, state)
            .catch((res, err) => { console.log(err) })
    }

    triggerTurnedOff(device, tokens, state) {
        this._flowTriggerTurnedOff
            .trigger(device, tokens, state)
            .catch((res, err) => { console.log(err) })
    }

}

module.exports = HomematicDriver;