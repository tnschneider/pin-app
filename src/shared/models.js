const url = require('url');

class Page {
    constructor(props) {
        this._id = props._id;
        this.url = props.url;
        this.sortOrder = props.sortOrder;
    }

    get id() {
        return this._id;
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