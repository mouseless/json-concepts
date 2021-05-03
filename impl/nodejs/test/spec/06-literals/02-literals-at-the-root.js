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
                "_": "services",
                "quantifier": { "min": 0, "max": 1 },
                "concept": {
                    "_": "service",
                    "quantifier": { "min": 1 },
                    "variable": { "_": "response" }
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
                    "_": "sayHello",
                    "response": "string"
                },
                {
                    "_": "sayGoodbye",
                    "response": "string"
                }
            ]
        });
    });
});
