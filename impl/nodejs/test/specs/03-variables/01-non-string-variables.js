const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/variables/non-string-variables', function () {
    const from = (path) => readTestCase(this, path);

    it('should set primitive values', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        const schema = concepts.create(from('greeting.service.json'));

        schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
    });
});
