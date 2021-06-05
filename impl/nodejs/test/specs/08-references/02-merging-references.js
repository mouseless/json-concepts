const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/references/merging-references', function () {
    const from = (path) => readTestCase(this, path);

    it('should merge multiple references', function () {
        const concepts = new Concepts(from('class-1.concepts.json'));

        concepts.definition.should.deep.equal(from('class-2.concepts.json'));
    });

    it('should merge any number of references', function () {
        const concepts = new Concepts({
            "merged": "#a & #b & #c",
            "#a": { "a": true },
            "#b": { "b": true },
            "#c": { "c": true }
        });

        concepts.definition.should.deep.equal({
            "merged": {
                "a": true,
                "b": true,
                "c": true
            }
        });
    });

    it('should give error when not all items in expression is a reference', function () {
        (() => new Concepts({
            "$class+": "#properties & $methods"
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

    it('should merge references in arrays and get object arrays', function () {
        const concepts = new Concepts({
            "classes": ["#properties & #methods"],
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
