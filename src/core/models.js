class Site {
    constructor(props) {
        this.id = props.id || props._id;
        this.url = props.url;
        this.stashed = props.stashed;
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