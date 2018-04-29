const { Page } = require("./models");

class Repository {
    constructor(db) {
        this.pages = db.pages;
        this.settings = db.settings;
    }

    getMaxSortOrder() {
        return new Promise((resolve, reject) => {
            this.pages.find({}, { sortOrder: 1 }).sort({ sortOrder: -1 }).limit(1).exec((err, page) => {
                if (err) {
                    reject(err);
                } else {
                    let result = (page && page.length === 1 ? page[0].sortOrder : -1) || -1;
                    resolve(result);
                }
            });
        })
    }

    getPages() {
        return new Promise((resolve, reject) => {
            this.pages.find({}).sort({ sortOrder: 1 }).exec((err, pages) => {
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
            this.getMaxSortOrder().then(max => {
                page.sortOrder = max + 1;
                this.pages.insert(new Page(page), (err, newPage) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new Page(newPage));
                    }
                });
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

    updatePageUrl(id, url) {
        return new Promise((resolve, reject) => {
            this.pages.update({ _id: id }, { $set: { url: url } }, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        })
    }

    updatePageSortOrder(id, sortOrder) {
        return new Promise((resolve, reject) => {
            this.pages.update({ _id: id }, { $set: { sortOrder: sortOrder } }, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    setSortOrder(sortOrder) {
        let promises = [];
        return new Promise((resolve, reject) => {
            Object.keys(sortOrder).forEach(x => {
                promises.push(this.updatePageSortOrder(x, sortOrder[x]));
            });

            Promise.all(promises).then(x => {
                resolve(true);
            }, err => {
                reject(err);
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