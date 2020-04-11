const {ucFirst, hasKey, is} = require('./util');

class ConfigResolver {
    constructor(config) {
        this.config = config;
    }

    resolve() {
        const {localhost} = this.config;
        if (hasKey(this.config, 'localhost') && !is('boolean', localhost)) {
            throw new Error(`Mongo plugin configuration error. If 'localhost' config is provided, it must be a boolean`);
        }

        if (!localhost) {
            const {host, port, dbName, auth, collections} = this.config;

            if (!hasKey(this.config, 'dbName')) {
                throw new Error(`Mongo plugin configuration error. 'dbName' is required and it must be a string`);
            }

            if (!is('string', dbName)) {
                throw new Error(`Mongo plugin configuration error. 'dbName' is required and it must be a string`);
            }

            if (hasKey(this.config, 'host') && !is('string', host)) {
                throw new Error(`Mongo plugin configuration error. If 'host' is provided, it must be a string`);
            }

            if (hasKey(this.config, 'port') && !Number.isInteger(port)) {
                throw new Error(`Mongo plugin configuration error. If 'port' is provided, it must be an integer`);
            }

            if (hasKey(this.config, 'auth') && !is('object', auth)) {
                throw new Error(`Mongo plugin configuration error. If 'auth' is provided, it must be an object`);
            }

            if (!hasKey(auth, 'username') || !hasKey(auth, 'password')) {
                throw new Error(`Mongo plugin configuration error. If 'auth' is provided, it must provide 'auth.username' and 'auth.password' that both must be strings`);
            }

            const {username, password} = auth;

            if (!is('string', username) || !is('string', password)) {
                throw new Error(`Mongo plugin configuration error. If 'auth' is provided, it must provide 'auth.username' and 'auth.password' that both must be strings`);
            }
        }

        if (hasKey(this.config, 'collections') && !Array.isArray(this.config['collections'])) {
            throw new Error(`Mongo plugin configuration error. If 'collections' is provided, it must be an array of strings`);
        }

        if (Array.isArray(this.config['collections'])) {
            const collections = this.config['collections'];
            const notString = collections.findIndex(c => !is('string', c));

            if (notString !== -1) {
                throw new Error(`Mongo plugin configuration error. If 'collections' is provided, it must be an array of strings`);
            }
        }

        if (hasKey(this.config, 'scope') && hasKey(this.config, 'shared')) {
            throw new Error(`Mongo plugin configuration error. Configuration cannot have 'scope' and 'shared' at the same`);
        }
    }
}

module.exports = ConfigResolver;