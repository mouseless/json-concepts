describe('json-loader', function () {
    after(function () {
        fs.restore();
    });

    it('should load if file exists and a valid json', function () {
        fs({
            'test.json': JSON.stringify({
                "test": "expected"
            })
        });

        const actual = JSON.load('test.json');

        actual.should.be.an('object');
        actual.test.should.equal("expected");
    });
    it('should give error if file is not json', function () {
        fs({
            'test.json': ''
        });

        (() => JSON.load('test.json')).should.throw(Error, ERR.FILE_is_not_a_valid_json('test.json').message);
    });
    it('should load remote file if it is a url', function () {
        nock('http://test.com')
            .get('/expected.json')
            .reply(200, {
                'test': 'expected'
            });

        const actual = JSON.load('http://test.com/expected.json');

        actual.should.be.an('object');
        actual.test.should.equal('expected');
    });
    it('should give error when remote file does not exist');
    it('should give error when local file does not exists');
    it('should return given object if it is already an object');
});

require('chai').should();
const fs = require('mock-fs');
const nock = require('nock');
const ERR = require('../../src/err');
require('../../src/json-load');