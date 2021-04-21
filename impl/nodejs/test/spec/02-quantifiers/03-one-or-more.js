const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/quantifiers/one-or-more', function () {
    it('should allow more than one concept', function () {
        const concepts = new Concepts({
            "$service+": {
                "$parameter?": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            },
            "sayGoodbye": {}
        })).should.not.throw();
    });

    describe('key literals', function () {
        it('should allow arrays as values of key literals', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "string",
                    "tags": ["readonly", "friendly"]
                },
                "sayGoodbye": {
                    "tags": ["readonly"]
                }
            })).should.not.throw();
        });

        it('should give error when a non array was given as a value of literals', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "string",
                    "tags": "readonly"
                }
            })).should.throw(
                error.Definition_is_not_valid__because__REASON(
                    because => because.LITERAL_expects_an_array_for_VARIABLE__but_got_an_instance_of_TYPE(
                        'tags', 'tags', 'string'
                    )
                ).message
            );
        });
    });

    describe('requires at least one', function () {
        it('should give error when at least one of that concept was not given', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            (() => concepts.validate({}))
                .should.throw(
                    error.Definition_is_not_valid__because__REASON(
                        because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                            'service', 1, 0
                        )
                    ).message
                );
        });
        it('should give error when at least one item exists in array for literals', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            (() => concepts.validate({
                "sayGoodbye": {
                    "tags": []
                }
            })).should.throw(
                error.Definition_is_not_valid__because__REASON(
                    because => because.LITERAL_requires_VARIABLE_array_to_have_at_least_MIN_item_s___but_got_COUNT(
                        'tags', 'tags', 1, 0
                    )
                ).message
            );
        });
    });

    describe('concepts shadow', function () {
        it('should not have max quantifier in shadow', function() {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "_": "service", 
                    "quantifier": {
                        "min": 1
                    },
                    "literal": {
                        "_": "tags",
                        "quantifier": {
                            "min": 1
                        },
                        "variable": {
                            "_": "tags"
                        }
                    },
                    "concept": {
                        "_": "parameter",
                        "quantifier": {
                            "min": 0,
                            "max": 1
                        },
                        "variable": {
                            "_": "type"
                        }
                    }
                }
            })
        });
    });

    describe('schema shadow', function () {
        it('should have array instead of object for concept and literal value of the shadow', function() {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                    "tags": [ "readonly", "friendly" ]
                },
                "sayGoodbye": {
                    "tags": [ "readonly" ]
                }
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "_": "sayHello",
                        "parameter": {
                            "_": "name",
                            "type": "string"
                        },
                        "tags": [ "readonly", "friendly" ]
                    },
                    {
                        "_": "sayGoodbye",
                        "parameter": null,
                        "tags": [ "readonly" ]
                    }
                ]
            });
        });
    });
});