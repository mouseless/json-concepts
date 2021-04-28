const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/arrays/object-arrays', function () {
    it('should allow object arrays for literals', function () {
        const concepts = new Concepts({
            "$service+": {
                "parameters?": [
                    {
                        "name": "$pName",
                        "type": "$pType"
                    }
                ]
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "_": "parameters",
                    "quantifier": { "min": 0, "max": 1 },
                    "variable": {
                        "dimensions": 1,
                        "literal": [
                            {
                                "_": "name",
                                "variable": { "_": "pName" }
                            },
                            {
                                "_": "type",
                                "variable": { "_": "pType" }
                            }
                        ]
                    }
                }
            }
        });
    });

    describe('schema', function () {
        it('should validate object arrays', function () {
            const concepts = new Concepts({
                "$service+": {
                    "parameters?": [
                        {
                            "name": "$pName",
                            "type": "$pType"
                        }
                    ]
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "parameters": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "surname",
                            "type": "string"
                        }
                    ]
                }
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "_": "sayHello",
                        "parameters": [
                            {
                                "pName": "name",
                                "pType": "string"
                            },
                            {
                                "pName": "surname",
                                "pType": "string"
                            }
                        ]
                    }
                ]
            });
        });

        it('should validate every item in object array', function () {
            const concepts = new Concepts({
                "$service+": {
                    "parameters?": [
                        {
                            "name": "$name",
                            "type?": "$type"
                        }
                    ]
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "parameters": [{}]
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('name')
                ).message
            );

            (() => concepts.validate({
                "sayHello": {
                    "parameters": [
                        { "name": "string" },
                        { "type": "string" }
                    ]
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('name')
                ).message
            );
        });

        it('should not accept arrays when object array is not expected', function () {
            const concepts = new Concepts({
                "zero": { "value": "$value" }
            });

            (() => concepts.validate({
                "zero": [{}]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_is_not_an_array(
                        'zero'
                    )
                ).message
            );
        });

        it('should treat the literal that holds the object array like a concept', function () {
            throw new Error('not implemented');
        });
    });

    describe('multi-dimensional array', function () {
        it('should allow more than one dimensions', function () {
            const concepts = new Concepts({
                "matrix": [[{ "value": "$value" }]]
            });

            const schema = concepts.create({
                "matrix": [[{ "value": 1 }, { "value": 2 }]]
            });

            schema.shadow.should.deep.equal({
                "matrix": [[
                    { "value": 1 },
                    { "value": 2 }
                ]]
            });
        });

        it('should allow less dimensions in schema', function () {
            const concepts = new Concepts({
                "matrix": [[{ "value": "$value" }]]
            });

            const schema1 = concepts.create({
                "matrix": [{ "value": 1 }, { "value": 2 }]
            });

            schema1.shadow.should.deep.equal({
                "matrix": [[
                    { "value": 1 },
                    { "value": 2 }
                ]]
            });

            const schema2 = concepts.create({
                "matrix": { "value": 1 }
            });

            schema2.shadow.should.deep.equal({
                "matrix": [[
                    { "value": 1 }
                ]]
            });
        });

        it('should not allow more dimensions than expected', function () {
            const concepts = new Concepts({
                "matrix": [[{ "value": "$value" }]]
            });

            (() => concepts.create({
                "matrix": [[[{ "value": 1 }]]]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                        'matrix', 2, 3
                    )
                ).message
            );
        });
    });

    describe('literal and concept conflicts', function () {
        it('should give error when a concept and a literal share same name');
        it('should allow conflicting literal name under another concept');
        it('should not allow conflicting literal under same concept even if it is nested');
    });

    describe('concepts and object arrays', function () {
        it('should not allow object array under a concept');
        it('should not allow concept inside an object array');
    });
});
