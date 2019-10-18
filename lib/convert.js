module.exports = {
    toFloat: function (value) {
        return parseFloat(value);
    },
    toString: function (value) {
        return value.toString();
    },
    toInt: function (value) {
        return parseInt(value);
    },
    toBoolean: function (value) {
        if (value === 0) {
            return false
        }
        return true
    },
    levelToOnOff: function (value) {
        if (value > 0) {
            return true
        }
        return value = false
    },
    toggleBoolean: function (value) {
        if (value === true) {
            return false
        }
        return true
    },
    onOffToLevel: function (value) {
        if (value === true) {
            return "0.99"
        } else {
            return "0.0"
        }
    },
    WhToKWh: function (value) {
        return parseFloat(value) / 1000
    },
    floatToPercent: function (value) {
        return parseFloat(value) * 100
    },
    ATomA: function (value) {
        return parseFloat(value) / 1000
    },
    toTrue: function (value) {
        return true
    },
    tofix: function (value) {
        return value.toFixed(1)
    },
    faultLowbatToBoolean: function(value) {
        if (value === 6) {
            return true
        }
        return false
    }
}
