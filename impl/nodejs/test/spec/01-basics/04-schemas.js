const Schema = require('../../../index').Schema;
const fs = require('mock-fs');
const should = require('chai').should();

describe('basics', function () {
    describe('schemas', function () {
        after(function () {
            fs.restore();
        });

        describe('default case', function () {
            it('should validate', function () {
                fs({
                    'service.concepts.json': JSON.stringify({
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    }),
                    'greeting.service.json': JSON.stringify({
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                const actual = Schema.load("greeting.service.json", "service.concepts.json");

                actual.should.be.an.instanceof(Schema);
            });
            it('should not validate if it does not conform to its concepts');
        });
        describe('self-validating schema', function () {
            it('should validate', function () {
                fs({
                    'service.concepts.json': JSON.stringify({
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    }),
                    'greeting.service.json': JSON.stringify({
                        "@concepts": "service.concepts.json",
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                const actual = Schema.load('greeting.service.json');

                actual.should.be.an.instanceof(Schema);
            });
            it('should not load if schema is not self-validating');
        });
        describe('referring-to-a-remote-concepts-file', function () {
            it('should validate');
        });
    });
});
