const { error, loadJSON } = require('../../src/util');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('#loadJSON', async function () {
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

        const actual = await loadJSON('test.json');

        actual.should.be.an('object');
        actual.test.should.equal("expected");
    });

    it('should give error if pathOrObject is not given', async function () {
        await loadJSON()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);
    });

    it('should give error if file is not json', async function () {
        fs({
            'test.json': ''
        });

        await loadJSON('test.json')
            .should.be.rejectedWith(error.FILE_is_not_a_valid_json('test.json').message);
    });

    it('should load remote file if it is a url', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(200, {
                'test': 'expected'
            });

        const actual = await loadJSON('http://test.com/expected.json');

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });

    it('should give error when remote file does not exist', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(400);

        await loadJSON('http://test.com/expected.json')
            .should.be.rejectedWith(error.Cannot_load_URL('http://test.com/expected.json').message);
    });

    it('should give error when local file does not exists', async function () {
        fs({
            //empty directory
        });

        await loadJSON('test.json')
            .should.be.rejectedWith(error.Cannot_load_FILE('test.json').message);
    });

    it('should give error when given path is not a string', async function () {
        await loadJSON({ test: 'expected' })
            .should.be.rejectedWith(error.Expected_type_was_EXPECTED_got_ACTUAL('string', 'object').message);
    });
});
