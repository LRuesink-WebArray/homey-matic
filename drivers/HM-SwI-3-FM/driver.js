'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [];
        this.homematicType = 'HM-SwI-3-FM';
        this.log(this.homematicType, 'has been inited');

        this._flowTriggerButtonPressed1 = new Homey.FlowCardTriggerDevice('HM-SwI-3-FM-pressed-1')
            .register()
        this._flowTriggerButtonPressed2 = new Homey.FlowCardTriggerDevice('HM-SwI-3-FM-pressed-2')
            .register()
        this._flowTriggerButtonPressed3 = new Homey.FlowCardTriggerDevice('HM-SwI-3-FM-pressed-3')
            .register()

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