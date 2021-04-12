const Concepts = require('../../../index').Concepts;
const should = require('chai').should();

describe('basics', function () {
    describe('concepts', function () {
        describe('default case', async function () {
            const testing = await Concepts.load({
                "$service": {
                    "$parameter": "$type"
                }
            });

            it('should validate', function () {
                testing.validate({
                    "sayGoodbye": {
                        "cry": "boolean"
                    }
                }).should.equal(true);
            });
        });
        describe('key literals under concepts', async function () {
            const testing = await Concepts.load({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            it('should validate', function () {
                testing.validate({
                    "sayGoodbye": {
                        "cry": "boolean",
                        "response": "string"
                    }
                }).should.equal(true);
            });

            it('should not validate', function () {
                testing.validate({
                    "sayGoodbye": {
                        "cry": "boolean"
                    }
                }).should.equal(false);
            });
        });
        describe('conflicts in key literals and concepts', async function () {
            const testing = await Concepts.load({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            it('should not validate', function () {
                testing.validate({
                    "sayGoodbye": {
                        "response": "string",
                        "response": "string"
                    }
                }).should.equal(false);
            });
        });
    });
});
