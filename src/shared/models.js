const url = require('url');

class Page {
    constructor(props) {
        this.id = props.id || props._id;
        this.url = props.url;
    }

    hostname() {
        return url.parse(this.url).hostname;
    }
}

class Settings {
    constructor(props) {
    }
}

module.exports = {
    Page,
    Settings
}