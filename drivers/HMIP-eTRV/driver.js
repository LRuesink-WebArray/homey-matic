'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'measure_temperature',
            'target_temperature',
            'homematic_thermostat_mode',
            'homematic_thermostat_boost',
            'homematic_thermostat_weekprofile',
            'homematic_measure_valve'
        ]
        this.homematicType = 'HMIP-eTRV'
        this.log(this.homematicType, 'has been inited');

        let weekprofileAction = new Homey.FlowCardAction('homematic_thermostat_set_weekprofile');
        weekprofileAction
            .register()
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_thermostat_weekprofile', args.weekprofile, {})

            })
    }


}

module.exports = HomematicDriver;