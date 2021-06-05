const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/references/defining-a-reference', function () {
    const from = (path) => readTestCase(this, path);

    it('should define a reference', function () {
        const class1 = new Concepts(from('class-1.concepts.json'));
        const class2 = new Concepts(from('class-2.concepts.json'));

        class1.definition.should.deep.equal(class2.definition);
        class1.shadow.should.deep.equal(class2.shadow);
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

    it('should escape macro character when it starts with an escape sequence', function () {
        const concepts = new Concepts({
            "\\#literal": "\\#value"
        });

        (() => concepts.validate({
            "#literal": "#value"
        })).should.not.throw();
    });

    describe('root', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error when a referenced defined in a child node', function () {
            (() => new Concepts(from('class.concepts.json')))
                .should.throw(
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.REFERENCE_should_be_defined_at_the_root(
                            '#method'
                        )
                    ).message
                );
        });
    });
});
