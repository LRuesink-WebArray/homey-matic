'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')
const Convert = require('../../lib/convert.js')

const doorStateToCoveringState = function (value) {
    if (value === "CLOSED") {
        return "down"
    } else if (value === "OPEN") {
        return "up"
    }

    return "idle"
}

const CoveringStateToDoorCommand = function (value) {
    if (value === "up") {
        return 1
    } else if (value === "down") {
        return 3
    }
    return 2
}

const SendPartialOpen = function(value) {
    if (value === true) {
        return 4
    }
    return undefined
}

const capabilityMap = {
    "windowcoverings_state": {
        "channel": 1,
        "key": "DOOR_STATE",
        "convert": doorStateToCoveringState,
        "set": {
            "key": "DOOR_COMMAND",
            "channel": 1,
            "convert": CoveringStateToDoorCommand
        }
    },
    "measure_mod_ho_door_state": {
        "channel": 1,
        "key": "DOOR_STATE",
        "convert": Convert.toString
    },
    "homematic_button_mod_ho_partial_open": {
        "set": {
            "key": "DOOR_COMMAND",
            "channel": 1,
            "convert": SendPartialOpen
        }
    }
}


class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
    }

}

module.exports = HomematicDevice;