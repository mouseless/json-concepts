const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/concepts/explicit-concepts', function () {
    const from = (path) => readTestCase(this, path);

    it('should set concept explicitly', function () {
        const concepts = new Concepts(from('class.concepts.json'));

        const schema = concepts.create(from('user.class.json'));

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

    describe('resolve', function () {
        const from = (path) => readTestCase(this, path);

        it('should set concept explicitly', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            const schema = concepts.create(from('log.service.json'));

            schema.shadow.service[0].parameter[0].name.should.be.equal('response');
        });
    });
});
