const { Schema } = require('../../../index');
const { should } = require('chai');

should();

describe('basics', function () {
    describe('shadows', function () {
        it('should cast shadow', async function () {
            const schema = await Schema.load({
                "@concepts": {
                    "$service": {
                        "$parameter": "$type",
                        "response": "$responseType"
                    }
                },
                "sayHello": {
                    "name": "string",
                    "response": "string"
                }
            });
            
            const shadow = schema.castShadow();

            shadow.service._.should.equal('sayHello');
            shadow.service.responseType.should.equal('string');
            shadow.service.parameter._.should.equal('name');
            shadow.service.parameter.type.should.equal('string');
        });

        describe('shadow concepts', function () {
            it('should cast shadow');
        });
    });
});
