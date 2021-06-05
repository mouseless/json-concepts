const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/custom-types/min-and-max-validators', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow only values more than or equal to min', function () {
        const concepts = new Concepts({
            "$service+": {
                "dailyCallLimit": "$dailyCallLimit:limit"
            },
            "@types": {
                "limit": {
                    "type": "number",
                    "min": 10
                }
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "dailyCallLimit": 10
            }
        })).should.not.throw();

        (() => concepts.validate({
            "sayHello": {
                "dailyCallLimit": 9
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    '9', 'limit'
                )
            ).message
        );
    });

    it('should allow only values less than or equal to max', function () {
        const concepts = new Concepts({
            "$service+": {
                "dailyCallLimit": "$dailyCallLimit:limit"
            },
            "@types": {
                "limit": {
                    "type": "number",
                    "max": 100
                }
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "dailyCallLimit": 100
            }
        })).should.not.throw();

        (() => concepts.validate({
            "sayHello": {
                "dailyCallLimit": 101
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    '101', 'limit'
                )
            ).message
        );
    });

    it('should validate length of the string when value is string', function () {
        const concepts = new Concepts({
            "$service+": {
                "name?": "$name:short-identifier",
                "surname?": "$surname:long-identifier"
            },
            "@types": {
                "short-identifier": {
                    "type": "string",
                    "max": 5
                },
                "long-identifier": {
                    "type": "string",
                    "min": 10
                }
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "a very long name"
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    'a very long name', 'short-identifier'
                )
            ).message
        );

        (() => concepts.validate({
            "sayHello": {
                "surname": "short"
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    'short', 'long-identifier'
                )
            ).message
        );
    });

    it('should allow usage of min and max together', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting-1.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '9', 'limit'
                    )
                ).message
            );

        (() => concepts.validate(from('greeting-2.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '101', 'limit'
                    )
                ).message
            );

        (() => concepts.validate(from('greeting-3.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '', 'identifier'
                    )
                ).message
            );

        (() => concepts.validate(from('greeting-4.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '01234567890', 'identifier'
                    )
                ).message
            );
    });
});
