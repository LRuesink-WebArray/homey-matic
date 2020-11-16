'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            "measure_mod_ho_door_state",
            "windowcoverings_set",
            "homematic_button_mod_ho_partial_open"
        ];
        this.homematicTypes = ['HmIP-MOD-HO'];
        this.log(this.homematicTypes.join(','), 'has been inited');

        let partialOpenAction = new Homey.FlowCardAction('homematic_mod_ho_set_partial_open');
        partialOpenAction
            .register()
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_button_mod_ho_partial_open', true, {})
            })
    }
}

module.exports = HomematicDriver;