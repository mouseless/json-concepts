const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/arrays/array-item-type', function () {
    it('should validate array items against its type expression', function () {
        const concepts = new Concepts({
            "tags?": ["$tags:string"]
        });

        (() => concepts.validate({
            "tags": ["only", "strings", "allowed"]
        })).should.not.throw();

        (() => concepts.validate({
            "tags": ["number", "not", "allowed", 0]
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    '0', 'string'
                )
            ).message
        );
    });

    describe('custom types', function () {
        it('should allow usage of custom type definitions', function() {
            const concepts = new Concepts({
                "$season*": [ "$months:month" ],
                "@types": {
                    "month": [
                        "JAN", "FEB", "MAR",
                        "APR", "MAY", "JUN",
                        "JUL", "AUG", "SEP",
                        "OCT", "NOV", "DEC"
                    ]
                }
            });

            (() => concepts.validate({
                "summer": [ "JUN", "JUL", "AUG" ]
            })).should.not.throw();
    
            (() => concepts.validate({
                "summer": [ "JUN", "JUL", "AUH" ]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'AUH', 'month'
                    )
                ).message
            );
        });
    });
});
