const { Schema } = require('../../..');
const fs = require('mock-fs');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

should();

describe('specs/concepts/inline-concepts', function () {
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
