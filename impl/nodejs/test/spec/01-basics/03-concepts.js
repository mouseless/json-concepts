const { Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('spec/basics/concepts', function () {
    it('should validate', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter": "$type"
            }
        });

        concepts.validate({
            "sayGoodbye": {
                "cry": "boolean"
            }
        }).should.equal(true);
    });

    describe('key literals under concepts', function () {
        it('should validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            concepts.validate({
                "sayGoodbye": {
                    "cry": "boolean",
                    "response": "string"
                }
            }).should.equal(true);
        });

        it('should not validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            concepts.validate({
                "sayGoodbye": {
                    "cry": "boolean"
                }
            }).should.equal(false);
        });
    });

    describe('conflicts in key literals and concepts', function () {
        it('should not validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            concepts.validate({
                "sayGoodbye": {
                    "response": "string",
                    "response": "string"
                }
            }).should.equal(false);
        });
    });
});
