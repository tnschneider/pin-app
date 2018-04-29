const url = require('url');

class Page {
    constructor(props) {
        this.id = props.id || props._id;
        this.url = props.url;
        this.sortOrder = props.sortOrder;
    }

    hostname() {
        return url.parse(this.url).hostname;
    }
}

class Settings {
    constructor(props) {
        this.windowBounds = props.windowBounds;
    }
}

module.exports = {
    Page,
    Settings
}