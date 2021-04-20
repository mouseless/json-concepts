const { Concepts } = require('../../../index');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/quantifiers/exactly-one', function () {
    it('should validate', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            }
        })).should.not.throw();
    });

    describe('missing a concept', function () {
        it('should give error', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type"
                }
            });

            (() => concepts.create({
                "sayHello": {}
            })).should.throw(
                error.Definition_is_not_valid__because__REASON(
                    because => because.CONCEPT_is_missing('parameter')
                ).message
            );
        });

        it('should give error with file name');
    });

    describe('missing more than one concept', function () {
        it('should give error');
        it('should give error with file name');
    });

    describe('key literals', function () {
        it('should give error');
        it('should give error with file name');
    });

    describe('null variables', function () {
        it('should set null to variables in shadow');
    });
});