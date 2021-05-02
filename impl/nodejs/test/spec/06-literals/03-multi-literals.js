const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/literals/multi-literals', function () {
    it('should allow multiple literals at the same level', function () {
        const concepts = new Concepts({
            "services?": {
                "$service+": "$response"
            },
            "models?": {
                "$model+": {
                    "$field*": "$type"
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "literal": [
                {
                    "_": "services",
                    "quantifier": { "min": 0, "max": 1 },
                    "concept": {
                        "_": "service",
                        "quantifier": { "min": 1 },
                        "variable": { "_": "response" }
                    }
                },
                {
                    "_": "models",
                    "quantifier": { "min": 0, "max": 1 },
                    "concept": {
                        "_": "model",
                        "quantifier": { "min": 1 },
                        "concept": {
                            "_": "field",
                            "quantifier": { "min": 0 },
                            "variable": { "_": "type" }
                        }
                    }
                }
            ]
        });

        const schema = concepts.create({
            "services": {
                "sayHello": "message",
                "sayGoodbye": "message"

            },
            "models": {
                "message": {
                    "text": "string",
                    "status": "number"
                }
            }
        });

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "_": "sayHello",
                    "response": "message"
                },
                {
                    "_": "sayGoodbye",
                    "response": "message"
                }
            ],
            "model": [
                {
                    "_": "message",
                    "field": [
                        {
                            "_": "text",
                            "type": "string"
                        },
                        {
                            "_": "status",
                            "type": "number"
                        }
                    ]
                }
            ]
        });
    });

    describe('multiple variables in a concepts', function () {
        it('should store more than one variable in a concept', function () {
            const concepts = new Concepts({
                "$filter+": {
                    "input": "$input",
                    "output": "$output"
                }
            });

            const schema = concepts.create({
                "append": {
                    "input": "string",
                    "output": "string"
                },
                "split": {
                    "input": "string",
                    "output": "array"
                }
            });

            schema.shadow.should.deep.equal({
                "filter": [
                    {
                        "_": "append",
                        "input": "string",
                        "output": "string"
                    },
                    {
                        "_": "split",
                        "input": "string",
                        "output": "array"
                    }
                ]
            });
        });
    });
});