const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/literals/only-literals', function () {
    it('should allow a concepts definition that consists of only literals', function () {
        const concepts = new Concepts({
            "service": {
                "name": "$name",
                "parameter": {
                    "name": "$parameterName",
                    "type": "$parameterType"
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "literal": {
                "_": "service",
                "literal": [
                    {
                        "_": "name",
                        "variable": { "_": "name" }
                    },
                    {
                        "_": "parameter",
                        "literal": [
                            {
                                "_": "name",
                                "variable": { "_": "parameterName" }
                            },
                            {
                                "_": "type",
                                "variable": { "_": "parameterType" }
                            }
                        ]
                    }
                ]
            }
        });

        const schema = concepts.create({
            "service": {
                "name": "sayHello",
                "parameter": {
                    "name": "name",
                    "type": "string"
                }
            }
        });

        schema.shadow.should.deep.equal({
            "name": "sayHello",
            "parameterName": "name",
            "parameterType": "string"
        });
    });

    it('should not allow duplicate variable name', function () {
        (() => new Concepts({
            "service": {
                "name": "$name",
                "parameter": {
                    "name": "$name",
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_declare_VARIABLE_more_than_once(
                    'name'
                )
            ).message
        );
    });

    describe('literals with object arrays instead of concepts', function () {
        it('should create schemas whose shadow is identical to their definitions', function () {
            const concepts = new Concepts({
                "services": [{
                    "name": "$name",
                    "parameters?": [{
                        "name": "$name",
                        "type": "$type"
                    }]
                }]
            });

            concepts.shadow.should.deep.equal({
                "literal": {
                    "_": "services",
                    "variable": {
                        "dimensions": 1,
                        "literal": [
                            {
                                "_": "name",
                                "variable": { "_": "name" }
                            },
                            {
                                "_": "parameters",
                                "quantifier": { "min": 0, "max": 1 },
                                "variable": {
                                    "dimensions": 1,
                                    "literal": [
                                        {
                                            "_": "name",
                                            "variable": { "_": "name" }
                                        },
                                        {
                                            "_": "type",
                                            "variable": { "_": "type" }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            });

            const schema = concepts.create({
                "services": [
                    {
                        "name": "sayHello",
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
                ]
            });

            schema.shadow.should.deep.equal({
                "services": [
                    {
                        "name": "sayHello",
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
                ]
            })
        });
    });
});