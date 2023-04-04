const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/literals/multi-literals', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow multiple literals at the same level', function () {
        const concepts = new Concepts(from('service.concepts.json'));
        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));

        const schema = concepts.create(from('greeting.service.json'));
        schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
    });

    describe('multiple-variables', function () {
        const from = (path) => readTestCase(this, path);

        it('should store more than one variable in a concept', function () {
            const concepts = new Concepts(from('filters.concepts.json'));
            const schema = concepts.create(from('default.filters.json'));

            schema.shadow.should.deep.equal(from('default.filters-shadow.json'));
        });
    });
});
