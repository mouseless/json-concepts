const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/quantifiers/zero-or-more', function () {
    it('should allow a concept to have one or many instances in schema', function () {
        const concepts = new Concepts({
            "$service+": {
                "$parameter*": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string",
                "surname": "string"
            },
            "sayGoodbye": {}
        })).should.not.throw();
    });

    describe('key literals', function () {
        it('should allow a literal to not exist', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "string",
                    "surname": "string",
                    "tags": ["readonly", "friendly"]
                },
                "sayGoodbye": {}
            })).should.not.throw();
        });

        it('should allow a literal to have an empty array', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "tags": []
                }
            })).should.not.throw();
        });

        it('should give error when null or a non-array is given to a literal array', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "tags": null
                }
            })).should.throw(
                error.Definition_is_not_valid__because__REASON(
                    because => because.LITERAL_expects_an_array_for_VARIABLE__but_got_null(
                        'tags', 'tags'
                    )
                ).message
            );

            (() => concepts.validate({
                "sayHello": {
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

    describe('concepts shadow', function () {
        it('should have set quantifier min to zero', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
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
                            "min": 0
                        },
                        "variable": {
                            "_": "tags"
                        }
                    },
                    "concept": {
                        "_": "parameter",
                        "quantifier": {
                            "min": 0
                        },
                        "variable": {
                            "_": "type"
                        }
                    }
                }
            });
        });
    });

    describe('schema shadow', function () {
        it('should have empty arrays instead of null values', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                    "surname": "string",
                    "tags": ["readonly", "friendly"]
                },
                "sayGoodbye": {}
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "_": "sayHello",
                        "parameter": [
                            {
                                "_": "name",
                                "type": "string"
                            },
                            {
                                "_": "surname",
                                "type": "string"
                            }
                        ],
                        "tags": ["readonly", "friendly"]
                    },
                    {
                        "_": "sayGoodbye",
                        "parameter": [],
                        "tags": []
                    }
                ]
            });
        });
    });
});