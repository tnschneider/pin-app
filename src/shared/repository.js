const { Page } = require("./models");

class Repository {
    constructor(db) {
        this.db = db;
    }

    getPages() {
        return new Promise((resolve, reject) => {
            this.db.pages.find({}, (err, pages) => {
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
            this.db.pages.insert(new Page(page), (err, newPage) => {
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
            this.db.pages.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

module.exports = Repository