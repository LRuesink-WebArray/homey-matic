'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_luminance.current',
            'measure_luminance.average',
            'measure_luminance.highest',
            'measure_luminance.lowest',
            'alarm_battery'
        ];
        this.homematicTypes = ['HmIP-SLO'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        var self = this;
        this._flowTriggerCurrentIlluminanceChanged = new Homey.FlowCardTriggerDevice('HmIP-SLO-illuminance-current')
            .register()
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerAverageIlluminanceChanged = new Homey.FlowCardTriggerDevice('HmIP-SLO-illuminance-average')
            .register()
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerHighestIlluminanceChanged = new Homey.FlowCardTriggerDevice('HmIP-SLO-illuminance-highest')
            .register()
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerLowestIlluminanceChanged = new Homey.FlowCardTriggerDevice('HmIP-SLO-illuminance-lowest')
            .register()
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
    }

    triggerCurrentIlluminanceChangedFlow(device, tokens, state) {
        this._flowTriggerCurrentIlluminanceChanged
            .trigger(device, tokens, state)
            .catch(this.error)
    }
    triggerAverageIlluminanceChangedFlow(device, tokens, state) {
        this._flowTriggerAverageIlluminanceChanged
            .trigger(device, tokens, state)
            .catch(this.error)
    }
    triggerHighestIlluminanceChangedFlow(device, tokens, state) {
        this._flowTriggerHighestIlluminanceChanged
            .trigger(device, tokens, state)
            .catch(this.error)
    }
    triggerLowestIlluminanceChangedFlow(device, tokens, state) {
        this._flowTriggerLowestIlluminanceChanged
            .trigger(device, tokens, state)
            .catch(this.error)
    }


}

module.exports = HomematicDriver;
