const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/literals/nested-literals', function () {
    it('should allow literals under literals', function () {
        const concepts = new Concepts({
            "$service+": {
                "response": {
                    "type": "$type",
                    "status": "$status"
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "_": "response",
                    "literal": [
                        {
                            "_": "type",
                            "variable": { "_": "type" }
                        },
                        {
                            "_": "status",
                            "variable": { "_": "status" }
                        }
                    ]
                }
            }
        });

        const schema = concepts.create({
            "sayHello": {
                "response": {
                    "type": "string",
                    "status": 200
                }
            }
        });

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "_": "sayHello",
                    "type": "string",
                    "status": 200
                }
            ]
        });
    });
});