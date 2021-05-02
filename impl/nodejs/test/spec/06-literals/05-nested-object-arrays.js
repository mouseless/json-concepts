const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/literals/nested-object-arrays', function () {
    it('should allow object arrays under object arrays', function () {
        const concepts = new Concepts({
            "$service+": {
                "parameters?": [{
                    "name": "$name",
                    "types": [{
                        "name": "$name",
                        "validation": ["$validators"]
                    }]
                }]
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
                                "variable": { "_": "name" }
                            },
                            {
                                "_": "types",
                                "variable": {
                                    "dimensions": 1,
                                    "literal": [
                                        {
                                            "_": "name",
                                            "variable": { "_": "name" }
                                        },
                                        {
                                            "_": "validation",
                                            "variable": {
                                                "_": "validators",
                                                "dimensions": 1
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        });

        const schema = concepts.create({
            "sayHello": {
                "parameters": [
                    {
                        "name": "name",
                        "types": [
                            {
                                "name": "string",
                                "validation": ["regex", "min"]
                            },
                            {
                                "name": "text",
                                "validation": ["regex", "max"]
                            }
                        ]
                    },
                    {
                        "name": "surname",
                        "types": [
                            {
                                "name": "string",
                                "validation": ["regex"]
                            }
                        ]
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
                            "name": "name",
                            "types": [
                                {
                                    "name": "string",
                                    "validators": ["regex", "min"]
                                },
                                {
                                    "name": "text",
                                    "validators": ["regex", "max"]
                                }
                            ]
                        },
                        {
                            "name": "surname",
                            "types": [
                                {
                                    "name": "string",
                                    "validators": ["regex"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    })
});