module.exports = {
    toFloat(value) {
        return parseFloat(value);
    },
    toString(value) {
        return value.toString();
    },
    toInt(value) {
        return parseInt(value);
    },
    toBoolean(value) {
        return value !== 0;
    },
    levelToOnOff(value) {
        return value > 0;
    },
    toggleBoolean(value) {
        return !value;
    },
    onOffToLevel(value) {
        return value ? "0.99" : "0.0";
    },
    WhToKWh(value) {
        return parseFloat(value) / 1000;
    },
    floatToPercent(value) {
        return Math.floor(parseFloat(value) * 100);
    },
    mAToA(value) {
        return parseFloat(value) / 1000;
    },
    toTrue() {
        return true;
    },
    tofix(value) { 
        return parseFloat(value).toFixed(2);
    },
    faultLowbatToBoolean(value) {
        return value === 6;
    }
};
