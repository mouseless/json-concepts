const { Schema } = require('../../..');
const fs = require('mock-fs');
const { should } = require('chai');

should();

describe('spec/concepts/inline-concepts', function () {
    after(function () {
        fs.restore();
    });

    it('should load schema using inline concepts definition', async function () {
        fs({
            'greeting.service.json': JSON.stringify({
                "@concepts": {
                    "$service+": {
                        "$parameter*": "$type"
                    }
                },
                "sayHello": {
                    "name": "string",
                    "surname": "string"
                }
            })
        });

        await Schema.load('greeting.service.json')
            .should.not.be.rejected;
    });
});
