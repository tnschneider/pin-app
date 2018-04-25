class Site {
    constructor(props) {
        this.id = props.id;
        this.url = props.url;
        this.stashed = props.stashed;
    }
}

class AppSettings {
    constructor(props) {

    }
}

export {
    Site,
    AppSettings
}