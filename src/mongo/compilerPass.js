const MongoClient = require('mongodb').MongoClient;
const {ucFirst, hasKey, is} = require('../../services/library/util');

function _resolveConfig(config) {
    if (hasKey(config, 'scope') && hasKey(config, 'shared')) {
        throw new Error(`Mongo plugin configuration error. Configuration cannot have 'scope' and 'shared' at the same`);
    }

    return config;
}

function _defineMongoService(config) {
    let url = '';
    const dbName = config['dbName'];

    if (config['localhost'] === true) {
        url = 'mongodb://localhost:27017';
    } else {
        const host = config['host'];
        const port = config['port'];
        const dbName = config['dbName'];
        const username = config['auth']['username'];
        const password = config['auth']['password'];
    }

    let visibility = {};
    if (config['scope']) {
        visibility.scope = config['scope'];
    } else if (config['shared']) {
        visibility.shared = config['shared'];
    }

    return {
        name: 'MongoService',
        ...visibility,
        isAsync: true,
        init: function(next, throwException) {
            const client = new MongoClient(url, {useUnifiedTopology: true});

            client.connect(function(err) {
                if (err) return throwException(err.message);

                const db = client.db(dbName);

                return next(() => {
                    return {
                        client: client,
                        db: db,
                    }
                });
            });
        }
    };
}

function _defineMongoCollectionDefinitions(config) {
    const definitions = [];
    const collections = config.collections;

    for (const collection of collections) {
        const name = `${ucFirst(collection)}Collection`;
        const definition = {
            name: name,
            scope: 'public',
            init: function(next, throwException, MongoService) {
                return MongoService.db.collection(collection);
            }
        };

        definitions.push(definition);
    }

    return definitions;
}

module.exports = {
    name: 'compilerPassDefinition',
    compilerPass: {
        init: function(config, compiler) {
            const mongoConfig = config['plugins']['mongoDb'];

            const resolvedConfig = _resolveConfig(mongoConfig);

            compiler.add(_defineMongoService(mongoConfig));

            if (mongoConfig.collections) {
                const definitions = _defineMongoCollectionDefinitions(mongoConfig);

                for (const definition of definitions) {
                    compiler.add(definition);
                }
            }
        }
    },
    init: function() {
        return {};
    }
};
