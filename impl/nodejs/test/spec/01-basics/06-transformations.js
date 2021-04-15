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
});
