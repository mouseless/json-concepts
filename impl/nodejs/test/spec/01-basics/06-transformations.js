const { Transformation, Schema, Concepts } = require('../../../index');

describe('spec/basics/transformations', function () {
    it('should transform', function () {
        const source = new Concepts({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        const target = new Concepts({
            "$function": {
                "$argument": "$type",
                "return": "$returnType"
            }
        });

        const transformation = new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType": "responseType"
                }
            },
            "argument": {
                "from": "parameter",
                "select": {
                    "type": "type"
                }
            }
        }, source, target);

        const input = source.create({
            "sayHello": {
                "name": "string",
                "response": "string"
            }
        });

        const output = transformation.transform(input);

        output.object.should.deep.equal({
            "sayHello": {
                "name": "string",
                "return": "string"
            }
        });
    });

    it('should give error when path is not supplied');
    it('should give error when schema is not supplied');
    it('should verify that given source and target are compatible with transformation');
    it('should validate given schema against source concepts');
    it('should create schema from source concepts when schema is an object');

    // TODO: check any inconsistency in api
});
