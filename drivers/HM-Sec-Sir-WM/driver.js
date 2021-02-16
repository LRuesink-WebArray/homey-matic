'use strict';

const Homey = require('homey');
const Driver = require('../../lib/driver.js');

class HomematicDriver extends Driver {

    onInit() {
        super.onInit();
        this.capabilities = [
            'onoff',
            'homematic_sec_sir_hm_armstate',
            'alarm_tamper',
            'alarm_battery'
        ]
        this.homematicTypes = ['HM-Sec-Sir-WM']
        this.numDevices = 3
        this.multiDevice = true
        this.log(this.homematicTypes.join(','), 'has been inited');

        let armstateAction = new Homey.FlowCardAction('homematic_sec_sir_hm_armstate');
        armstateAction
            .register()
            .registerRunListener((args, state) => {
                return args.device.triggerCapabilityListener('homematic_sec_sir_hm_armstate', args.armstate, {})
            })

    }

}

module.exports = HomematicDriver;