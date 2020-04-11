const mocha = require('mocha');
const chai = require('chai');

const it = mocha.it;
const xit = mocha.xit;
const describe = mocha.describe;
const expect = chai.expect;

describe('Failing config tests', () => {
    it('should fail if localhost is not a boolean', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: 'not boolean',
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'localhost' config is provided, it must be a boolean`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if dbName prop is not provided', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. 'dbName' is required and it must be a string`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if dbName prop is not a string', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 1234,
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. 'dbName' is required and it must be a string`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if host prop is provided but is not a string', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: 123
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'host' is provided, it must be a string`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if port prop is provided but is not an integer', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 'not an integer'
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'port' is provided, it must be an integer`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if auth prop is provided but is not an object', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: null,
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'auth' is provided, it must be an object`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if auth prop is provided but it does\'t have auth.username and auth.password', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {},
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'auth' is provided, it must provide 'auth.username' and 'auth.password' that both must be strings`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if auth.username is not a string', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: null,
                password: 'mile',
            },
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'auth' is provided, it must provide 'auth.username' and 'auth.password' that both must be strings`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if auth.password is not a string', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: 'username',
                password: null,
            },
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'auth' is provided, it must provide 'auth.username' and 'auth.password' that both must be strings`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if both scope and shared props are provided', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: 'username',
                password: 'password',
            },
            scope: 'public',
            shared: {},
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. Configuration cannot have 'scope' and 'shared' at the same`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if collections prop is not an array', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: 'username',
                password: 'password',
            },
            scope: 'public',
            collections: null,
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'collections' is provided, it must be an array of strings`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should fail if collections prop is not an array of strings', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: 'username',
                password: 'password',
            },
            scope: 'public',
            collections: ['str1', 'str2', null],
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
            expect(e.message).to.be.equal(`Mongo plugin configuration error. If 'collections' is provided, it must be an array of strings`);
        }

        expect(entersError).to.be.equal(true);
    });

    it('should not fail if collections prop is an empty array', () => {
        const ConfigResolver = require('../../src/mongo/lib/configResolver');
        const cr = new ConfigResolver({
            localhost: false,
            dbName: 'dbName',
            host: '127.0.0.1',
            port: 56,
            auth: {
                username: 'username',
                password: 'password',
            },
            scope: 'public',
            collections: [],
        });

        let entersError = false;
        try {
            cr.resolve();
        } catch (e) {
            entersError = true;
        }

        expect(entersError).to.be.equal(false);
    });
});