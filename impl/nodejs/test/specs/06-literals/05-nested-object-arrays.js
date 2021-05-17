const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('specs/literals/nested-object-arrays', function () {
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

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "name": "parameters",
                    "quantifier": { "min": 0, "max": 1 },
                    "variable": {
                        "dimensions": 1,
                        "literal": [
                            {
                                "name": "name",
                                "variable": { "name": "name" }
                            },
                            {
                                "name": "types",
                                "variable": {
                                    "dimensions": 1,
                                    "literal": [
                                        {
                                            "name": "name",
                                            "variable": { "name": "name" }
                                        },
                                        {
                                            "name": "validation",
                                            "variable": {
                                                "name": "validators",
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

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "name": "sayHello",
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
