class Logger {
    constructor(homey) {
        this.homey = homey;
        this.lines = [];
    }

    log(level, ...args) {
        let line = args.join(' ');

        switch(level) {
            case 'error':
            case 'debug':
            case 'info':
                this.homey.app.log( line );

                if (this.lines.length >= 50) {
                    this.lines.shift();
                }
                this.lines.push(line);
                break;
        }
    }

    getLogLines() {
        return this.lines;
    }
}

module.exports = Logger