module.exports = {
    async getLogLines({homey, query}) {
        var result = homey.app.getLogLines(query);
        callback(null, result);
    },
    async getStoredBridges({homey, query}) {
        var bridges = homey.app.getStoredBridges();
        var result = [];
        Object.keys(bridges).forEach((serial) => {
            result.push('Serial: ' + serial + ' IP: ' + bridges[serial].address)
        })
        callback(null, result);
    },
    async deleteStoredBridges({homey, query}) {
        var bridges = homey.app.deleteStoredBridges();
        var result = true;
        callback(null, result);
    }
}
