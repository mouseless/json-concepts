const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/concepts/multi-concepts', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow more than one concept at the same level', function () {
        const concepts = new Concepts(from('class.concepts.json'));

        concepts.shadow.should.deep.equal(from('class.concepts-shadow.json'));
    });

    describe('conflicts', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error when two concepts share the same name', function () {
            (() => new Concepts(from('invalid.concepts.json')))
                .should.throw(
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.Cannot_declare_CONCEPT_more_than_once(
                            'conflict'
                        )
                    ).message
                );
        });
    });

    describe('resolution', function () {
        const from = (path) => readTestCase(this, path);

        it('should set concept of a schema to the first validating concept', function () {
            const concepts = new Concepts(from('class.concepts.json'));

            const schema = concepts.create(from('user.class.json'));

            schema.shadow.should.deep.equal(from('user.class-shadow.json'));
        });

        it('should give error when none of the concepts validate a schema', function () {
            const concepts = new Concepts(from('class.concepts.json'));

            (() => concepts.create({
                "user": {
                    "login": {
                        "username": "string",
                        "password": "string"
                    }
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing(
                        'returns'
                    )
                ).message
            );
        });
    });

    describe('more-than-one', function () {
        const from = (path) => readTestCase(this, path);

        it('should set the concept to the first one when more than one concept matches', function () {
            const concepts = new Concepts(from('../class.concepts.json'));

            const schema = concepts.create(from('user.class.json'));

            schema.shadow.class[0].property[0].name.should.be.equal('logout');
        });
    });
});
