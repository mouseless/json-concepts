var Concepts = require("../../src/concepts").Concepts;
var should = require('chai').should();


describe('basics', function () {
    describe('concepts', function () {
        describe('default case', function () {
            var testing = Concepts.load({
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
        describe('key literals under concepts', function () {
            var testing = Concepts.load({
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
        describe('conflicts in key literals and concepts', function () {
            var testing = Concepts.load({
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
