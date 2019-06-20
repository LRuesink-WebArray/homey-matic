'use strict';

const Homey = require('homey');
const Device = require('../../lib/device.js')

const activivateStateToCoveringState = function (value) {
    if (value === 1) {
        return "up"
    } else if (value === 2) {
        return "down"
    }
    return "idle"
}

const convertSetKey = function (key, value) {
    if (value === "up") {
        return "LEVEL"
    } else if (value === "down") {
        return "LEVEL"
    }
    return "STOP"
}

const convertSetState = function (value) {
    if (value === "up") {
        return "1.0"
    } else if (value === "down") {
        return "0.0"
    }
    return true
}

const capabilityMap = {
    "windowcoverings_set": {
        "channel": 1,
        "key": "LEVEL",
        "set": {
            "key": "LEVEL",
            "channel": 1
        }
    },
    "windowcoverings_state": {
        "channel": 1,
        "key": "DIRECTION",
        "convert": activivateStateToCoveringState,
        "set": {
            "key": "LEVEL",
            "channel": 1,
            "convert": convertSetState,
            "convertKey": convertSetKey
        }
    }
}

class HomematicDevice extends Device {

    onInit() {
        super.onInit(capabilityMap);
        this._driver = this.getDriver();
    }

    initializeExtraEventListeners() {
    }
}

module.exports = HomematicDevice;