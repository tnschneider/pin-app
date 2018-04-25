const url = require('url');

class Site {
    constructor(props) {
        this.id = props.id || props._id;
        this.url = props.url;
        this.stashed = props.stashed;
    }

    hostname() {
        return url.parse(this.url).hostname;
    }
}

class AppSettings {
    constructor(props) {

    }
}

module.exports = {
    Site,
    AppSettings
}