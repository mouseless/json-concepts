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
                    "name": "services",
                    "quantifier": { "min": 0, "max": 1 },
                    "concept": {
                        "name": "service",
                        "quantifier": { "min": 1 },
                        "variable": { "name": "response" }
                    }
                },
                {
                    "name": "models",
                    "quantifier": { "min": 0, "max": 1 },
                    "concept": {
                        "name": "model",
                        "quantifier": { "min": 1 },
                        "concept": {
                            "name": "field",
                            "quantifier": { "min": 0 },
                            "variable": { "name": "type" }
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
                    "name": "sayHello",
                    "response": "message"
                },
                {
                    "name": "sayGoodbye",
                    "response": "message"
                }
            ],
            "model": [
                {
                    "name": "message",
                    "field": [
                        {
                            "name": "text",
                            "type": "string"
                        },
                        {
                            "name": "status",
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
                        "name": "append",
                        "input": "string",
                        "output": "string"
                    },
                    {
                        "name": "split",
                        "input": "string",
                        "output": "array"
                    }
                ]
            });
        });
    });
});
