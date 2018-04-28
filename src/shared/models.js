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

class AppSettings {
    constructor(props) {

    }
}

module.exports = {
    Page,
    AppSettings
}