const { Concepts } = require("../../..");
const { error } = require("../../../src/util");
const { should } = require('chai');

should();

describe('spec/quantifiers/zero-or-one', function () {
    it('should validate schema 1', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter?": "string"
            }
        });

        (() => concepts.validate({
            "sayHello": {}
        })).should.not.throw();
    });

    it('should validate schema 2', function() {
        const concepts = new Concepts({
            "$service": {
                "$parameter?": "string"
            }
        });

        (() => concepts.validate({
            "sayHello": { 
                "name": "string"
            }
        })).should.not.throw();
    });

    describe('more than one concept fails validation', function () {
        it('should give error', function() {
            const concepts = new Concepts({
                "$service": {
                    "$parameter?": "string"
                }
            });
    
            (() => concepts.validate({
                "sayHello": { 
                    "name": "string",
                    "surname": "string"
                }
            })).should.throw(
                error.Definition_is_not_valid__because__REASON(
                    because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT('parameter', 1, 2)
                ).message
            );
        });
    })

    describe('key literals', function () {
        it('should validate');
    });

    describe('concepts shadow', function () {
        it('should include quantifier information');
    });

    describe('schema shadow', function () {
        it('should set value to null for optional literals');
        it('should set value to null for optional concepts');
    });

    describe('null concepts', function () {
        it('should allow null when everything under that concept is optional');
        it('should include literal and concept keys even if they are not given');
    });
});