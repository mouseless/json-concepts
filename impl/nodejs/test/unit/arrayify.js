const { arrayify, error } = require('../../src/util');
const { should } = require('chai');

should();

describe('arrayify', function () {
    describe('#get', function () {
        it('should return as is if source[key] is already an array', function () {
            const actual = arrayify.get({ array: [1, 2] }, 'array');

            actual.should.be.an('array');
            actual.length.should.equal(2);
            actual[0].should.equal(1);
            actual[1].should.equal(2);
        });

        it('should return in an array if source[key] is not array', function () {
            const actual = arrayify.get({ string: "test" }, 'string');

            actual.should.be.an('array');
            actual.length.should.equal(1);
            actual[0].should.equal('test');
        });

        it('should return empty array if source[key] is undefined', function () {
            const actual = arrayify.get({}, 'ghost');

            actual.should.be.an('array');
            actual.length.should.equal(0);
        });

        it('should throw error when a parameter is not given', function () {
            (() => arrayify.get())
                .should.throw(error.PARAMETER_is_required('source').message);

            (() => arrayify.get({}))
                .should.throw(error.PARAMETER_is_required('key').message);
        });
    });

    describe('#pushOrSet', function () {
        it('should push value to array if source[key] is array', function () {
            const source = { 'array': [1, 2] };

            arrayify.pushOrSet(source, 'array', 3);

            source.array.length.should.equal(3);
            source.array[2].should.equal(3);
        });

        it('should make source[key] an array and push value to source if source[key] is object', function () {
            const source = { 'array': 1 };

            arrayify.pushOrSet(source, 'array', 2);

            source.array.should.be.an('array');
            source.array.length.should.equal(2);
            source.array[1].should.equal(2);
        });

        it('should set value to source if source[key] is undefined', function () {
            const source = {};

            arrayify.pushOrSet(source, 'string', "test");

            source.string.should.be.a('string');
            source.string.should.equal("test");
        });

        it('should throw error when a parameter is not given', function () {
            (() => arrayify.pushOrSet())
                .should.throw(error.PARAMETER_is_required('source').message);

            (() => arrayify.pushOrSet({}))
                .should.throw(error.PARAMETER_is_required('key').message);

            (() => arrayify.pushOrSet({}, 'test'))
                .should.throw(error.PARAMETER_is_required('value').message);
        });
    })
});