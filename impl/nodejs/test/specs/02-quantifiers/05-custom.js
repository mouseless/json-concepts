const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/quantifiers/custom', function () {
    const from = (path) => readTestCase(this, path);

    it('should support {#,#} syntax', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
    });

    it('should include check min max values and include them in error messages', function () {
        const concepts = new Concepts({
            '$service{1,3}': {
                '$parameter{,2}': '$type',
                'response{1}': {
                    '$status{2,}': '$responseType'
                }
            }
        });

        (() => concepts.validate({}))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                        'service', 1, 0
                    )
                ).message
            );

        (() => concepts.validate({
            'a': { 'response': { '200': 'string', '400': 'string' } },
            'b': { 'response': { '200': 'string', '400': 'string' } },
            'c': { 'response': { '200': 'string', '400': 'string' } },
            'd': { 'response': { '200': 'string', '400': 'string' } }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                    'service', 3, 4
                )
            ).message
        );

        (() => concepts.validate({
            'sayHello': {
                'name': 'string',
                'middle': 'string',
                'surname': 'string',
                'response': { '200': 'string', '400': 'string' }
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                    'parameter', 2, 3
                )
            ).message
        );

        (() => concepts.validate({
            'sayHello': {}
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.LITERAL_is_missing('response')
            ).message
        );

        (() => concepts.validate({
            'sayHello': {
                'response': { '200': 'string' }
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                    'status', 2, 1
                )
            ).message
        );
    });

    it('should only allow quantifier max 1 for key literals', function () {
        (() => new Concepts({
            'service{1,1}': {}
        })).should.not.throw();

        (() => new Concepts({
            'service{,1}': {}
        })).should.not.throw();

        (() => new Concepts({
            'service{0,1}': {}
        })).should.not.throw();

        (() => new Concepts({
            'service{1}': {}
        })).should.not.throw();

        (() => new Concepts({
            'service{,2}': {}
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.LITERAL_cannot_have_QUANTIFIER(
                    'service', '{,2}'
                )
            ).message
        );
    });
});
