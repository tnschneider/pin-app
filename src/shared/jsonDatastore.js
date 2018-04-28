const fs = require('fs');

class JsonDatastore {
    constructor(props) {
        this.filepath = props.filepath;
        this.mapper = props.mapper;
    }

    get() {
        return new Promise((resolve, reject) => {
            //append empty string to file first so it gets created if it doesn't exist
            fs.appendFile(this.filepath, '', () => {
                fs.readFile(this.filepath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        let result = this.deserialize(data);
    
                        resolve(result);
                    }
                });
            });
        })
    }

    set(payload) {
        return new Promise((resolve, reject) => {
            var json = this.serialize(payload);

            fs.writeFile(this.filepath, json, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    }

    patch(payload) {
        return new Promise((resolve, reject) => {
            this.get().then(currentObj => {
                var newObj = Object.assign({}, currentObj, payload);
                var json = this.serialize(newObj);

                fs.writeFile(this.filepath, json, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        })
    }

    serialize(obj) {
        return JSON.stringify(this.mapper(obj));
    }

    deserialize(json) {
        try {
            let obj = JSON.parse(json);
            return this.mapper(obj);
        } catch (e) {
            return this.mapper({});
        }
    }
}

module.exports = JsonDatastore;