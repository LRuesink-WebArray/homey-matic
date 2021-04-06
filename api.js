module.exports = {
    async getLogLines({homey, query}) {
        var result = homey.app.getLogLines(query);
        return result;
    },
    async getStoredBridges({homey, query}) {
        var bridges = homey.app.getStoredBridges();
        var result = [];
        Object.keys(bridges).forEach((serial) => {
            result.push('Serial: ' + serial + ' IP: ' + bridges[serial].address)
        })
        return result;
    },
    async deleteStoredBridges({homey, query}) {
        var bridges = homey.app.deleteStoredBridges();
        var result = true;
        return result;
    }
}
