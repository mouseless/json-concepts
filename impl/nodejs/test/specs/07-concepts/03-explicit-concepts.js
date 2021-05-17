const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/concepts/explicit-concepts', function () {
    it('should set concept explicitly', function () {
        const concepts = new Concepts({
            "$class*": {
                "$property*": {
                    "returns": "$returnType"
                },
                "$method*": {
                    "$parameter*": "$type",
                    "returns": "$returnType"
                }
            }
        });

        const schema = concepts.create({
            "user": {
                "logout:method": {
                    "returns": "number"
                }
            }
        });

        schema.shadow.class[0].method[0].name.should.be.equal('logout');
    });

    it('should give error when concept does not exist', function () {
        const concepts = new Concepts({
            "$class*": {
                "$property*": {
                    "returns": "$returnType"
                }
            }
        });

        (() => concepts.create({
            "user": {
                "logout:method": {
                    "returns": "number"
                }
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.EXPRESSION_could_not_be_parsed__CONCEPT_does_not_exist(
                    'logout:method', 'method'
                )
            ).message
        );
    });

    it('should give syntax error when nothing follows type symbol', function () {
        const concepts = new Concepts({
            "$class*": {
                "$property*": {
                    "returns": "$returnType"
                }
            }
        });

        (() => concepts.create({
            "user": {
                "logout:": {
                    "returns": "number"
                }
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.Concept_expected_in_EXPRESSION(
                    'logout:'
                )
            ).message
        );
    });

    describe('resolving literal conflicts', function () {
        it('should set concept explicitly', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "response?": "$responseType"
                }
            });

            const schema = concepts.create({
                "writeLog": {
                    "response:parameter": "string"
                }
            });

            schema.shadow.service[0].parameter[0].name.should.be.equal('response');
        });
    });
});
