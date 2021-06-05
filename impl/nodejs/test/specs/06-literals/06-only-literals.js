const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/literals/only-literals', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow a concepts definition that consists of only literals', function () {
        const concepts = new Concepts(from('service.concepts.json'));
        const schema = concepts.create(from('greeting.service.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
    });

    it('should not allow duplicate variable name', function () {
        (() => new Concepts({
            "service": {
                "name": "$name",
                "parameter": {
                    "name": "$name",
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_declare_VARIABLE_more_than_once(
                    'name'
                )
            ).message
        );
    });

    describe('object-arrays', function () {
        const from = (path) => readTestCase(this, path);

        it('should create schemas whose shadow is identical to their definitions', function () {
            const concepts = new Concepts(from('service.concepts.json'));
            concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));

            const schema = concepts.create(from('greeting.service.json'));
            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });
});
