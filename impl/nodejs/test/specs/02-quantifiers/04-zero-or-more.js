const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/quantifiers/zero-or-more', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow a concept to have one or many instances in schema', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.not.throw();
    });

    describe('key-literals', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow a literal to not exist', function () {
            (() => new Concepts(from('service.concepts.json')))
                .should.throw(
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.LITERAL_cannot_have_QUANTIFIER(
                            'tags', '*'
                        )
                    ).message
                );
        });
    });

    describe('concepts-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should have set quantifier min to zero', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        });
    });

    describe('schema-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should have empty arrays instead of null values', function () {
            const concepts = new Concepts(from('../concepts-shadow/service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });
});
