'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'alarm_homematic_rain',
            'onoff'
        ]
        this.homematicTypes = ['HM-Sen-RD-O']
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerTurnedOn = this.homey.flow.getDeviceTriggerCard('HM-Sen-RD-O-turned-on')

        this._flowTriggerTurnedOff = this.homey.flow.getDeviceTriggerCard('HM-Sen-RD-O-turned-off')
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