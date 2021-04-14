const { Schema, Concepts } = require('../../../index');

describe('spec/basics/transformations', function () {
    it('should transform', function() {
        const source = Concepts.load({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        const target = Concepts.load({
            "$function": {
                "$argument": "$type",
                "return": "$returnType"
            }
        });

        const transformation = {};
    });
});
