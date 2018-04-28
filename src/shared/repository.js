const { Page } = require("./models");

class Repository {
    constructor(db) {
        this.pages = db.pages;
        this.settings = db.settings;
    }

    getPages() {
        return new Promise((resolve, reject) => {
            this.pages.find({}, (err, pages) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(pages.map(x => new Page(x)));
                }
            });
        })
        
    }

    addPage(page) {
        return new Promise((resolve, reject) => {
            this.pages.insert(new Page(page), (err, newPage) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Page(newPage));
                }
            });
        });
    }

    deletePage(id) {
        return new Promise((resolve, reject) => {
            this.pages.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    getSettings() {
        return this.settings.get();
    }

    setSettings(payload) {
        return this.settings.set(payload);
    }

    patchSettings(payload) {
        return this.settings.patch(payload);
    }
}

module.exports = Repository