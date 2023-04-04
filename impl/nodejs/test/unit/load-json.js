const { error, loadJSON, loadJSONData } = require('../../src/util');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('#loadJSONData', async function () {
    after(async function () {
        fs.restore();
    });

    afterEach(async function () {
        nock.cleanAll();
    });

    it('should load if file exists and a valid json', async function () {
        fs({
            'test.json': JSON.stringify({
                'test': 'expected'
            })
        });

        const actual = await loadJSONData('test.json');

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });

    it('should give error if pathOrObject is not given', async function () {
        await loadJSONData()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);
    });

    it('should give error if file is not json', async function () {
        fs({
            'test.json': ''
        });

        await loadJSONData('test.json')
            .should.be.rejectedWith(error.FILE_is_not_a_valid_json('test.json').message);
    });

    it('should load remote file if it is a url', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(200, {
                'test': 'expected'
            });

        const actual = await loadJSONData('http://test.com/expected.json');

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });

    it('should give error when remote file does not exist', async function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(400);

        await loadJSONData('http://test.com/expected.json')
            .should.be.rejectedWith(error.Cannot_load_URL('http://test.com/expected.json').message);
    });

    it('should give error when local file does not exist', async function () {
        fs({
            //empty directory
        });

        await loadJSONData('test.json')
            .should.be.rejectedWith(error.Cannot_load_FILE('test.json').message);
    });

    it('should give error when given path is not a string', async function () {
        await loadJSONData({ test: 'expected' })
            .should.be.rejectedWith(error.Expected_type_was_EXPECTED_got_ACTUAL('string', 'object').message);
    });
});

describe('#loadJSON', async function () {
    after(async function () {
        fs.restore();
    });

    afterEach(async function () {
        nock.cleanAll();
    });

    it('should return loaded json object and resolved path', async function () {
        fs({
            '/path/test.json': JSON.stringify({
                'test': 'expected'
            })
        });

        const actual = await loadJSON('test.json', '/path/other.json');

        actual.path.should.be.equal('/path/test.json');
        actual.data.should.be.an('object');
        actual.data.test.should.equal('expected');
    });

    describe('absolute paths', function () {
        before(function () {
            fs({
                '/absolute/test.json': '{}'
            });
        });

        [
            { path: '/absolute/test.json', relativeTo: 'other.json' },
            { path: '/absolute/test.json', relativeTo: '/other/absolute/other.json' },
            { path: '/absolute/test.json', relativeTo: 'http://test.com/path/other.json' },
        ].forEach(item =>
            it(`should load '${item.path}' relative to '${item.relativeTo}'`, async function () {
                await loadJSON(item.path, item.relativeTo).should.not.be.rejected;
            })
        );
    });

    describe('relative paths', function () {
        before(function () {
            fs({
                '/absolute/test.json': '{}',
                'relative/test.json': '{}'
            });
        });

        [
            // /absolute/test.json
            { path: 'test.json', relativeTo: '/absolute/other.json' },
            { path: 'absolute/test.json', relativeTo: '/other.json' },
            { path: '../test.json', relativeTo: '/absolute/subfolder/other.json' },

            // relative/test.json
            { path: 'test.json', relativeTo: 'relative/other.json' },
            { path: 'relative/test.json', relativeTo: 'other.json' },
            { path: '../test.json', relativeTo: 'relative/sub/other.json' },
            { path: '../../relative/test.json', relativeTo: 'other/relative/other.json' }
        ].forEach(item =>
            it(`should load '${item.path}' relative to '${item.relativeTo}'`, async function () {
                await loadJSON(item.path, item.relativeTo).should.not.be.rejected;
            })
        );
    });

    describe('absolute urls', function () {
        beforeEach(function () {
            nock('http://test.com')
                .get('/path/test.json')
                .reply(200, {
                    'test': 'expected'
                });
        });

        [
            { path: 'http://test.com/path/test.json', relativeTo: 'other.json' },
            { path: 'http://test.com/path/test.json', relativeTo: '/other/absolute/other.json' },
            { path: 'http://test.com/path/test.json', relativeTo: 'http://test.com/path/other.json' }
        ].forEach(item =>
            it(`should load '${item.path}' relative to '${item.relativeTo}'`, async function () {
                await loadJSON(item.path, item.relativeTo).should.not.be.rejected;
            })
        );
    });

    describe('relative urls', function () {
        beforeEach(function () {
            nock('http://test.com')
                .get('/path/test.json')
                .reply(200, {
                    'test': 'expected'
                });
        });

        [
            // http://test.com/path/test.json
            { path: 'test.json', relativeTo: 'http://test.com/path/other.json' },
            { path: 'path/test.json', relativeTo: 'http://test.com/other.json' },
            { path: '../test.json', relativeTo: 'http://test.com/path/sub/other.json' },
            { path: '../../path/test.json', relativeTo: 'http://test.com/other/path/other.json' }
        ].forEach(item =>
            it(`should load '${item.path}' relative to '${item.relativeTo}'`, async function () {
                await loadJSON(item.path, item.relativeTo).should.not.be.rejected;
            })
        );
    });
});
