const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/references/defining-a-reference', function () {
    it('should define a reference', function () {
        const concepts = new Concepts({
            "$class+": "#properties",
            "#properties": {
                "$property*": "$type"
            }
        });

        concepts.definition.should.deep.equal({
            "$class+": {
                "$property*": "$type"
            }
        });
    });

    it('should not affect shadow of a concepts definition', function () {
        const concepts = new Concepts({
            "$class+": "#properties",
            "#properties": {
                "$property*": "$type"
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "class",
                "quantifier": { "min": 1 },
                "concept": {
                    "_": "property",
                    "quantifier": { "min": 0 },
                    "variable": { "_": "type" }
                }
            }
        });
    });

    it('should allow to be used multiple times', function () {
        const concepts = new Concepts({
            "$concept1": "#ref",
            "$concept2": "#ref",
            "#ref": "$value"
        });

        concepts.definition.should.deep.equal({
            "$concept1": "$value",
            "$concept2": "$value"
        });
    });

    it('should make a deep search', function () {
        const concepts = new Concepts({
            "$concept": {
                "$concept": {
                    "$concept": {
                        "$concept": "#ref"
                    }
                }
            },
            "#ref": "$value"
        });

        concepts.definition.should.deep.equal({
            "$concept": {
                "$concept": {
                    "$concept": {
                        "$concept": "$value"
                    }
                }
            }
        });
    });

    it('should give error when a reference does not exist', function () {
        (() => new Concepts({
            "$concept": "#wrong"
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.REFERENCE_cannot_be_found(
                    '#wrong'
                )
            ).message
        );
    });

    it('should give error when a reference definition does not have a name', function () {
        (() => new Concepts({
            "#": "$value"
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Reference_EXPRESSION_must_have_a_name(
                    '$value'
                )
            ).message
        );
    });

    describe('references can only be defined at the root', function () {
        it('should give error when a referenced defined in a child node', function () {
            (() => {
                const concepts = new Concepts({
                    "$class+": {
                        "$method*": "#method",
                        "#method": {
                            "$parameter*": "$type",
                            "returns": "$type"
                        }
                    }
                });

                return concepts;
            }).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.REFERENCE_should_be_defined_at_the_root(
                        '#method'
                    )
                ).message
            );
        });
    });
});