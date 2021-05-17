const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/variables/multiple-reference-to-a-variable', function () {
    it('should not allow same variable name more than once', function () {
        (() => new Concepts({
            "$concept": {
                "literal1": "$value",
                "literal2": "$value"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.CONCEPT_cannot_declare_VARIABLE_more_than_once(
                    'concept', 'value'
                )
            ).message
        );
    });
});
