const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/variables/duplicate-variables', function () {
    const from = (path) => readTestCase(this, path);

    it('should not allow same variable name more than once', function () {
        (() => new Concepts(from('example.concepts.json')))
            .should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.CONCEPT_cannot_declare_VARIABLE_more_than_once(
                        'concept', 'value'
                    )
                ).message
            );
    });
});
