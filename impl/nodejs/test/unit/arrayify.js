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

    describe('#push', function () {
        it('should push value to array if source[key] is array', function () {
            const source = { 'array': [1, 2] };

            arrayify.push(source, 'array', 3);

            source.array.length.should.equal(3);
            source.array[2].should.equal(3);
        });

        it('should make source[key] an array and push value to source if source[key] is object', function () {
            const source = { 'array': 1 };

            arrayify.push(source, 'array', 2);

            source.array.should.be.an('array');
            source.array.length.should.equal(2);
            source.array[1].should.equal(2);
        });

        it('should set value to source if source[key] is undefined', function () {
            const source = {};

            arrayify.push(source, 'string', "test");

            source.string.should.be.a('string');
            source.string.should.equal("test");
        });

        it('should throw error when a parameter is not given', function () {
            (() => arrayify.push())
                .should.throw(error.PARAMETER_is_required('source').message);

            (() => arrayify.push({}))
                .should.throw(error.PARAMETER_is_required('key').message);

            (() => arrayify.push({}, 'test'))
                .should.throw(error.PARAMETER_is_required('value').message);
        });
    })

    describe('#dimensions', function () {
        it('should return zero for regular variables', function () {
            arrayify.dimensions("test")
                .should.be.equal(0);
        });

        it('should return one for empty array', function () {
            arrayify.dimensions([])
                .should.be.equal(1);
        })

        it('should return one for one dimensional array', function () {
            arrayify.dimensions(["test"])
                .should.be.equal(1);
        })

        it('should return n for n dimensional array', function () {
            arrayify.dimensions([[[[[]]]]])
                .should.be.equal(5);
        })

        it('should return zero for undefined or null', function () {
            arrayify.dimensions()
                .should.be.equal(0);

            arrayify.dimensions(null)
                .should.be.equal(0);
        })
    })

    describe('#make', function () {
        it('should return value as is if given value matches desired dimensions', function () {
            arrayify.make(0, "test")
                .should.be.equal("test");

            arrayify.make(1, [])
                .should.deep.equal([]);

            arrayify.make(2, [[]])
                .should.deep.equal([[]]);
        });

        it('should add missing dimensions', function () {
            arrayify.make(3, "test")
                .should.deep.equal([[["test"]]]);

            arrayify.make(3, ["test"])
                .should.deep.equal([[["test"]]]);

            arrayify.make(3, [["test"]])
                .should.deep.equal([[["test"]]]);
        });

        it('should return value as is if given value has more than desired dimensions', function () {
            arrayify.make(1, [["test"]])
                .should.deep.equal([["test"]]);
        });
    });
});