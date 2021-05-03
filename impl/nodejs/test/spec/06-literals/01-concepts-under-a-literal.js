const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/literals/concept-under-a-literal', function () {
    it('should allow concepts under literals', function () {
        const concepts = new Concepts({
            "$service+": {
                "response": {
                    "$property*": "$type"
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "_": "response",
                    "concept": {
                        "_": "property",
                        "quantifier": { "min": 0 },
                        "variable": { "_": "type" }
                    }
                }
            }
        });

        const schema = concepts.create({
            "sayHello": {
                "response": {
                    "message": "string",
                    "status": "number"
                }
            }
        });

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "_": "sayHello",
                    "property": [
                        {
                            "_": "message",
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
});
