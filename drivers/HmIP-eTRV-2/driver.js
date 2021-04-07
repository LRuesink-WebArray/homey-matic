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
        this.homematicTypes = ['HmIP-eTRV-2'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        this.homey.flow.getActionCard('homematic_thermostat_set_weekprofile')
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_thermostat_weekprofile', args.weekprofile, {})

            })

        this.homey.flow.getActionCard('homematic_thermostat_set_mode')
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_thermostat_mode', args.mode, {})

            })

    }


}

module.exports = HomematicDriver;