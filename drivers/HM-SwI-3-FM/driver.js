'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [];
        this.homematicTypes = ['HM-SwI-3-FM'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        this._flowTriggerButtonPressed1 = this.homey.flow.getDeviceTriggerCard('HM-SwI-3-FM-pressed-1')
        this._flowTriggerButtonPressed2 = this.homey.flow.getDeviceTriggerCard('HM-SwI-3-FM-pressed-2')
        this._flowTriggerButtonPressed3 = this.homey.flow.getDeviceTriggerCard('HM-SwI-3-FM-pressed-3')

    }

    triggerButtonPressedFlow1(device, tokens, state) {
        this._flowTriggerButtonPressed1
            .trigger(device, tokens, state)
            .then(this.log("Flow triggered"))
            .catch(this.error)
    }

    triggerButtonPressedFlow2(device, tokens, state) {
        this._flowTriggerButtonPressed2
            .trigger(device, tokens, state)
            .then(this.log("Flow triggered"))
            .catch(this.error)
    }
    triggerButtonPressedFlow3(device, tokens, state) {
        this._flowTriggerButtonPressed3
            .trigger(device, tokens, state)
            .then(this.log("Flow triggered"))
            .catch(this.error)
    }
}

module.exports = HomematicDriver;