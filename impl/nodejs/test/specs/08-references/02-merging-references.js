const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/references/merging-references', function () {
    it('should merge multiple references', function () {
        const concepts = new Concepts({
            "$class+": "#properties & #methods",
            "#properties": {
                "$property*": "$type"
            },
            "#methods": {
                "$method*": {
                    "$parameter*": "$type",
                    "returns": "$type"
                }
            }
        });

        concepts.definition.should.deep.equal({
            "$class+": {
                "$property*": "$type",
                "$method*": {
                    "$parameter*": "$type",
                    "returns": "$type"
                }
            }
        });
    });

    it('should give error when not all items in expression is a reference', function () {
        (() => new Concepts({
            "$class+": "#properties & $methods",
            "#properties": {
                "$property*": "$type"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.All_items_in_EXPRESSION_should_be_a_reference(
                    "#properties & $methods"
                )
            ).message
        );
    });

    it('should give error when one of the references not refer to an object', function () {
        (() => new Concepts({
            "$class+": "#properties & #methods",
            "#properties": {
                "$property*": "$type"
            },
            "#methods": "$type"
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_merge_a_non_object_reference__REFERENCE(
                    '#methods'
                )
            ).message
        );
    });

    it('should give error when conflict occurs during merge', function () {
        (() => new Concepts({
            "$class+": "#properties & #methods",
            "#properties": {
                "$property*": "$type"
            },
            "#methods": {
                "$property*": "$type"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_merge_REFERENCES__conflict_occurs_on_KEY(
                    ["#properties", "#methods"], '$property*'
                )
            ).message
        );
    });
    
    it('should merge references in object arrays', function () {
        const concepts = new Concepts({
            "classes": [ "#properties & #methods" ],
            "#properties": {
                "$property*": "$type"
            },
            "#methods": {
                "$method*": {
                    "$parameter*": "$type",
                    "returns": "$type"
                }
            }
        });

        concepts.definition.should.deep.equal({
            "classes": [{
                "$property*": "$type",
                "$method*": {
                    "$parameter*": "$type",
                    "returns": "$type"
                }
            }]
        });
    });
});
