const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/custom-types/enum-validator', function () {
    it('should allow only one of enum members', function () {
        const concepts = new Concepts({
            "$service+": {
                "statusCode": "$statusCode:httpStatus"
            },
            "@types": {
                "httpStatus": {
                    "type": "number",
                    "enum": [200, 400, 500]
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "name": "statusCode",
                    "variable": {
                        "name": "statusCode",
                        "type": "httpStatus"
                    }
                }
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "statusCode": 200
            }
        })).should.not.throw();
    });

    it('should give error when an enum variable has unlisted value', function () {
        const concepts = new Concepts({
            "$service+": {
                "statusCode": "$statusCode:httpStatus"
            },
            "@types": {
                "httpStatus": {
                    "type": "number",
                    "enum": [200, 400, 500]
                }
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "statusCode": 404
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    '404', 'httpStatus'
                )
            ).message
        );
    });

    describe('short-hand usage', function () {
        it('should recognize enum validator from array definition', function () {
            const concepts = new Concepts({
                "$service+": {
                    "statusCode": "$statusCode:httpStatus"
                },
                "@types": {
                    "httpStatus": [200, 400, 500]
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "statusCode": 200
                }
            })).should.not.throw();

            (() => concepts.validate({
                "sayHello": {
                    "statusCode": 404
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '404', 'httpStatus'
                    )
                ).message
            );
        });

        it('should have common type of all values as a base type automatically', function () {
            const concepts = new Concepts({
                "@types": {
                    "numbers": [200, 400, 500],
                    "strings": ["A", "B", "C"],
                    "booleans": [true, false]
                }
            });

            concepts.types.find(type => type.name === 'numbers')
                .base.name.should.be.equal('number');
            concepts.types.find(type => type.name === 'strings')
                .base.name.should.be.equal('string');
            concepts.types.find(type => type.name === 'booleans')
                .base.name.should.be.equal('boolean');
        })
    });

    describe('enum of any type', function () {
        it('should have any base type when multiple type of objects exist in enum array', function () {
            const concepts = new Concepts({
                "$service+": {
                    "statusCode": "$statusCode:httpStatus"
                },
                "@types": {
                    "httpStatus": [200, "400", 500]
                }
            });

            concepts.types.find(type => type.name === 'httpStatus')
                .base.name.should.be.equal('any');
        });
    });
});
