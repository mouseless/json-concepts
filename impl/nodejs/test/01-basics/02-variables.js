var Concepts = require("../../src/concepts").Concepts;
var should = require('chai').should();


describe('basics', function () {
    describe('variables', function () {
        describe('default case', function () {
            var testing = Concepts.load({
                "sayHello": {
                    "name": "$type"
                }
            });

            it('should validate schema 1', function () {
                testing.validate({
                    "sayHello": {
                        "name": "string"
                    }
                }).should.equal(true);
            });

            it('should validate schema 2', function () {
                testing.validate({
                    "sayHello": {
                        "name": "text"
                    }
                }).should.equal(true);
            });
        });
    });
});
