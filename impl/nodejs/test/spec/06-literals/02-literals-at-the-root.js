const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/literals/literals-at-the-root', function () {
    it('should allow literals at the root', function () {
        const concepts = new Concepts({
            "services?": {
                "$service+": "$response"
            }
        });

        concepts.shadow.should.deep.equal({
            "literal": {
                "name": "services",
                "quantifier": { "min": 0, "max": 1 },
                "concept": {
                    "name": "service",
                    "quantifier": { "min": 1 },
                    "variable": { "name": "response" }
                }
            }
        });

        const schema = concepts.create({
            "services": {
                "sayHello": "string",
                "sayGoodbye": "string"
            }
        });

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "name": "sayHello",
                    "response": "string"
                },
                {
                    "name": "sayGoodbye",
                    "response": "string"
                }
            ]
        });
    });
});
