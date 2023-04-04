const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/basics/literals', function () {
    const from = (path) => readTestCase(this, path);

    it('should validate', async function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.not.throw();
    });

    it('should give error when definition is not supplied to constructor', function () {
        (() => new Concepts())
            .should.throw(error.PARAMETER_is_required('definition').message);
    });

    it('should not validate if parameter is null or undefined', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate())
            .should.throw(error.PARAMETER_is_required('schema').message);
        (() => concepts.validate(null))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.CONCEPT_is_missing('sayHello')
                ).message
            );
    });

    it('should not validate if root keys does not exist', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate({}))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.CONCEPT_is_missing('sayHello')
                ).message
            );
    });

    it('should not validate if all schema is not the same recursively', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate({
            'sayHello': {}
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.LITERAL_is_missing('name')
            ).message
        );
    });

    it('should not validate if schema has more things than concepts', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate({
            'sayHello': {
                'name': 'string',
                'surname': 'string'
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.TOKEN_is_not_expected('surname')
            ).message
        );
    });

    it('should not validate if value side does not fit concepts literal', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate({
            'sayHello': {
                'name': 'text'
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.Expected_LITERAL__but_got_VALUE('string', 'text')
            ).message
        );
    });
});
