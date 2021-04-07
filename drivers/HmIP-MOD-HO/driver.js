'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            "measure_mod_ho_door_state",
            "windowcoverings_state",
            "homematic_button_mod_ho_partial_open",
            "onoff"
        ];
        this.homematicTypes = ['HmIP-MOD-HO'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        this.homey.flow.getActionCard('homematic_mod_ho_set_partial_open')
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_button_mod_ho_partial_open', true, {})
            })
    }
}

module.exports = HomematicDriver;