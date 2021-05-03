const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/references/merging-references', function () {
    it('should merge multiple references', function () {
        const concepts = new Concepts({
            "$class+": ["#properties", "#methods"],
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

    it('should give error when an array does not have a non-macro item', function () {
        (() => new Concepts({
            "$class+": ["#properties", "$methods"],
            "#properties": {
                "$property*": "$type"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.All_items_in_ARRAY_should_be_a_reference(
                    ["#properties", "$methods"]
                )
            ).message
        );
    });

    it('should give error when one of the references not refer to an object', function () {
        (() => new Concepts({
            "$class+": ["#properties", "#methods"],
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

    it('should allow macros in object arrays', function () {
        const concepts = new Concepts({
            "classes": [{
                "name": "$name",
                "properties": "#properties"
            }],
            "#properties": [{
                "name": "$name",
                "type": "$type"
            }]
        });

        concepts.definition.should.deep.equal({
            "classes": [{
                "name": "$name",
                "properties": [{
                    "name": "$name",
                    "type": "$type"
                }]
            }]
        });
    });

    it('should give error when conflict occurs during merge', function () {
        (() => new Concepts({
            "$class+": ["#properties", "#methods"],
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
});