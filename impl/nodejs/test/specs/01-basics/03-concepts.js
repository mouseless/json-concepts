const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should: buildShould } = require('chai');

const should = buildShould();

describe('specs/basics/concepts', function () {
    it('should validate', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter": "$type"
            }
        });

        (() => concepts.validate({
            "sayGoodbye": {
                "cry": "boolean"
            }
        })).should.not.throw();
    });

    it('should be able to list all concepts', function () {
        const concepts = new Concepts({
            "$concept1": {
                "$concept1_1": {
                    "$concept1_1_1": "text"
                },
                "$concept1_2": {
                    "$concept1_2_1": "text"
                }
            },
            "$concept2": {
                "$concept2_1": {
                    "$concept2_1_1": "text"
                },
                "$concept2_2": "text"
            }
        });

        const actual = concepts.list;
        actual.should.be.an('array');
        actual.length.should.equal(9);
        should.exist(actual.find(c => c.name === "concept1"));
        should.exist(actual.find(c => c.name === "concept1_1"));
        should.exist(actual.find(c => c.name === "concept1_1_1"));
        should.exist(actual.find(c => c.name === "concept1_2"));
        should.exist(actual.find(c => c.name === "concept1_2_1"));
        should.exist(actual.find(c => c.name === "concept2"));
        should.exist(actual.find(c => c.name === "concept2_1"));
        should.exist(actual.find(c => c.name === "concept2_1_1"));
        should.exist(actual.find(c => c.name === "concept2_2"));
    });

    it('should be able to get a concept', function () {
        const concepts = new Concepts({
            "$concept1": {
                "$concept2": "text"
            }
        });

        concepts.has('concept1').should.equal(true);
        concepts.get('concept1').name.should.equal('concept1');
        concepts.has('concept2').should.equal(true);
        concepts.get('concept2').name.should.equal('concept2')
        concepts.has('concept3').should.equal(false);
        should.not.exist(concepts.get('concept3'));
    });

    it('should be able to list all variables of each concept', function () {
        const concepts = new Concepts({
            "$concept1": {
                "$concept2": {
                    "literal1": "$variable2_1",
                    "literal2": {
                        "literal3": "$variable2_2"
                    }
                },
                "literal1": "$variable1_1",
                "literal2": {
                    "literal3": "$variable1_2"
                }
            }
        });

        const variables1 = Object.values(concepts.get('concept1').variables);
        variables1.length.should.equal(2);
        variables1[0].name.should.equal('variable1_1');
        variables1[1].name.should.equal('variable1_2');

        const variables2 = Object.values(concepts.get('concept2').variables);
        variables2.length.should.equal(2);
        variables2[0].name.should.equal('variable2_1');
        variables2[1].name.should.equal('variable2_2');
    });

    it('should be able to get a variable of a concept', function () {
        const concepts = new Concepts({
            "$concept1": "$variable1"
        });

        const variable = concepts.get('concept1').variables['variable1'];

        should.exist(variable);
        variable.name.should.equal('variable1');
    });

    describe('key literals under concepts', function () {
        it('should validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            (() => concepts.validate({
                "sayGoodbye": {
                    "cry": "boolean",
                    "response": "string"
                }
            })).should.not.throw();
        });

        it('should not validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            (() => concepts.validate({
                "sayGoodbye": {
                    "cry": "boolean"
                }
            })).should.throw(error.Schema_definition_is_not_valid__REASON(
                because => because.LITERAL_is_missing('response')
            ).message);
        });
    });

    describe('conflicts in key literals and concepts', function () {
        it('should not validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            (() => concepts.validate({
                "sayGoodbye": {
                    "response": "string",
                    "response": "text"
                }
            })).should.throw(error.Schema_definition_is_not_valid__REASON(
                because => because.CONCEPT_is_missing('parameter')
            ).message);
        });
    });
});
