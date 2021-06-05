const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/literals/nested-object-arrays', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow object arrays under object arrays', function () {
        const concepts = new Concepts(from('service.concepts.json'));
        const schema = concepts.create(from('greeting.service.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
    })
});
