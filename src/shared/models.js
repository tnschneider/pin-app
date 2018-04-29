const url = require('url');

class Page {
    constructor(props) {
        this._id = props._id;
        this.url = props.url;
        this.sortOrder = props.sortOrder;
        this.shouldUpdateUrlOnNavigate = props.shouldUpdateUrlOnNavigate;
        this.faviconSrc = props.faviconSrc;
    }

    get id() {
        return this._id;
    }

    get domain() {
        const hostname = url.parse(this.url).hostname;
        const parts = hostname.split('.');
        return parts.length > 2 ? parts.slice(1).join('.') : hostname;
    }

    get faviconUrl() {
        return this.faviconSrc || `https://www.google.com/s2/favicons?domain=${this.domain}`;
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