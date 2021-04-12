const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('mock-fs');
const nock = require('nock');
const ERR = require('../../src/err');
require('../../src/json-load');

use(chaiAsPromised);
should();

describe('json-loader', async function () {
    after(async function () {
        fs.restore();
    });

    afterEach(async function () {
        nock.cleanAll();
    })

    it('should load if file exists and a valid json', async function () {
        fs({
            'test.json': JSON.stringify({
                "test": "expected"
            })
        });

        const actual = await JSON.load('test.json');

        actual.should.be.an('object');
        actual.test.should.equal("expected");
    });
    it('should give error if pathOrObject is not given', async function () {
        await JSON.load()
            .should.be.rejectedWith(ERR.PARAMETER_is_required('pathOrObject').message);
    });
    it('should give error if file is not json', async function () {
        fs({
            'test.json': ''
        });

        await JSON.load('test.json')
            .should.be.rejectedWith(ERR.FILE_is_not_a_valid_json('test.json').message);
    });
    it('should load remote file if it is a url', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(200, {
                'test': 'expected'
            });

        const actual = await JSON.load('http://test.com/expected.json');

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });
    it('should give error when remote file does not exist', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(400);

        await JSON.load('http://test.com/expected.json')
            .should.be.rejectedWith(ERR.Cannot_load_URL('http://test.com/expected.json').message);
    });
    it('should give error when local file does not exists', async function () {
        fs({
            //empty directory
        });

        await JSON.load('test.json')
            .should.be.rejectedWith(ERR.Cannot_load_FILE('test.json').message);
    });
    it('should return given object if it is already an object', async function () {
        const actual = await JSON.load({ test: 'expected' });

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });
});
