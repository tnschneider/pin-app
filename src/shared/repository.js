const { Site } = require("./models");

class Repository {
    constructor(db) {
        this.db = db;
    }

    getSites() {
        return new Promise((resolve, reject) => {
            this.db.sites.find({}, (err, sites) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(sites.map(x => new Site(x)));
                }
            });
        })
        
    }

    addSite(site) {
        return new Promise((resolve, reject) => {
            this.db.sites.insert(new Site(site), (err, newSite) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Site(newSite));
                }
            });
        });
    }

    deleteSite(id) {
        return new Promise((resolve, reject) => {
            this.db.sites.remove({ _id: id }, {}, (err, numRemoved) => {
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