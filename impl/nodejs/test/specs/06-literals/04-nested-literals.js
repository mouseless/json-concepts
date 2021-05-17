const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('specs/literals/nested-literals', function () {
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
                "name": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "name": "response",
                    "literal": [
                        {
                            "name": "type",
                            "variable": { "name": "type" }
                        },
                        {
                            "name": "status",
                            "variable": { "name": "status" }
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
                    "name": "sayHello",
                    "type": "string",
                    "status": 200
                }
            ]
        });
    });
});
