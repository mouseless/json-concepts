const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/literals/nested-literals', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow literals under literals', function () {
        const concepts = new Concepts(from('nested.concepts.json'));
        concepts.shadow.should.deep.equal(from('nested.concepts-shadow.json'));

        const schema = concepts.create(from('text.nested.json'));
        schema.shadow.should.deep.equal(from('text.nested-shadow.json'));
    });
});
