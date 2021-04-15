const { Transformation, Concepts } = require('../../../index');

describe('spec/basics/transformations', function () {
    it('should transform', async function () {
        const source = await Concepts.load({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        const target = await Concepts.load({
            "$function": {
                "$argument": "$type",
                "return": "$returnType"
            }
        });

        const transformation = await Transformation.load({
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

        const input = await source.load({
            "sayHello": {
                "name": "string",
                "response": "string"
            }
        });

        const output = transformation.transform(input);

        output.should.deep.equal({
            "sayHello": {
                "name": "string",
                "return": "string"
            }
        });
    });
});
