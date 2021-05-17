const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/basics/shadows', function () {
    it('should cast shadow', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "literal": {
                    "name": "response",
                    "variable": {
                        "name": "responseType"
                    }
                },
                "concept": {
                    "name": "parameter",
                    "variable": {
                        "name": "type"
                    }
                }
            }
        })
    });

    it('should have literal as leaf when no variable was given', function () {
        const concepts = new Concepts({
            "$service": {
                "response": "string"
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "literal": {
                    "name": "response",
                    "literal": {
                        "name": "string"
                    }
                }
            }
        })
    });

    describe('schema shadow', function () {
        it('should cast shadow', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                    "response": "string"
                }
            });

            schema.shadow.should.deep.equal({
                "service": {
                    "name": "sayHello",
                    "parameter": {
                        "name": "name",
                        "type": "string"
                    },
                    "responseType": "string"
                }
            });
        });
    });
});
