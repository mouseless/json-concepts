const { Concepts, Schema } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/quantifiers/exactly-one', function () {
    const from = (path) => readTestCase(this, path);

    after(function () {
        fs.restore();
    });

    it('should validate', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.not.throw();
    });

    it('should give error with file name', async function () {
        fs({
            'service.concepts.json': JSON.stringify(from('service.concepts.json')),
            'greeting.service.json': JSON.stringify({})
        });

        await Schema.load('greeting.service.json', 'service.concepts.json')
            .should.be.rejectedWith("'greeting.service.json'");
    });

    describe('missing-one', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.CONCEPT_is_missing('parameter')
                    ).message
                );
        });
    });

    describe('missing-two', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.CONCEPT_is_missing('service')
                    ).message
                );
        });
    });

    describe('key-literals', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.LITERAL_is_missing('response')
                    ).message
                );
        });
    });

    describe('null', function () {
        const from = (path) => readTestCase(this, path);

        it('should set null to variables in shadow', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });
});
