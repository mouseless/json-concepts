const { Schema, Concepts } = require('../../..');
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
            concept: {
                _: "service",
                literal: {
                    _: "response",
                    variable: {
                        _: "responseType"
                    }
                },
                concept: {
                    _: "parameter",
                    variable: {
                        "_": "type"
                    }
                }
            }
        })
    });

    it('should have literal as leaf when no variable was given', function() {
        const concepts = new Concepts({
            "$service": {
                "response": "string"
            }
        });

        concepts.shadow.should.deep.equal({
            concept: {
                _: "service",
                literal: {
                    _: "response",
                    literal: {
                        _: "string"
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
                service: {
                    _: "sayHello",
                    parameter: {
                        _: "name",
                        type: "string"
                    },
                    responseType: "string"
                }
            });
        });
    });
});
