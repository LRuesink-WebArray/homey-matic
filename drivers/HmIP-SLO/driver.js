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
        this._flowTriggerCurrentIlluminanceChanged = this.homey.flow.getDeviceTriggerCard('HmIP-SLO-illuminance-current')
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerAverageIlluminanceChanged = this.homey.flow.getDeviceTriggerCard('HmIP-SLO-illuminance-average')
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerHighestIlluminanceChanged = this.homey.flow.getDeviceTriggerCard('HmIP-SLO-illuminance-highest')
            .registerRunListener((args, state) => {
                return Promise.resolve(true)
            })
        this._flowTriggerLowestIlluminanceChanged = this.homey.flow.getDeviceTriggerCard('HmIP-SLO-illuminance-lowest')
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
