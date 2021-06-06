const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/quantifiers/zero-or-one', function () {
    const from = (path) => readTestCase(this, path);

    it('should validate schema 1', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting-1.service.json')))
            .should.not.throw();
    });

    it('should validate schema 2', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting-2.service.json')))
            .should.not.throw();
    });

    describe('more-than-one', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT('parameter', 1, 2)
                    ).message
                );
        });
    });

    describe('key-literals', function () {
        const from = (path) => readTestCase(this, path);

        it('should validate', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.not.throw();
        });
    });

    describe('concepts-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should include quantifier information', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        });
    });

    describe('schema-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should set value to null for optional concepts and literals', function () {
            const concepts = new Concepts(from('../concepts-shadow/service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });

    describe('null', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow null when everything under that concept is optional', function () {
            const concepts = new Concepts(from('../concepts-shadow/service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.not.throw();
        });

        it('should include literal and concept keys even if they are not given', function () {
            const concepts = new Concepts(from('../concepts-shadow/service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });
});
