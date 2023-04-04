const { Schema } = require('../../..');
const fs = require('mock-fs');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { readTestCase } = require('../../lib');

use(chaiAsPromised);
should();

should();

describe('specs/concepts/inline-concepts', function () {
    const from = (path) => readTestCase(this, path);

    after(function () {
        fs.restore();
    });

    it('should load schema using inline concepts definition', async function () {
        fs({
            'greeting.service.json': JSON.stringify(from('greeting.service.json'))
        });

        await Schema.load('greeting.service.json')
            .should.not.be.rejected;
    });
});
