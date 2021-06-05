const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/references/injections', function () {
    const from = (path) => readTestCase(this, path);

    it('should inject definition to path', function () {
        const concepts = new Concepts(from('class-1.concepts.json'));

        concepts.definition.should.deep.equal(from('class-2.concepts.json'));
    });

    it('should give error when conflict occurs', function () {
        (() => new Concepts({
            "$class+": {
                "$property*": {}
            },
            "#inject": {
                "$property*": "$returnType",
                "@path": "/$class"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_assign_SOURCE_to_KEY__there_is_already_a_value__TARGET(
                    '$returnType', '$property*', {}
                )
            ).message
        )
    });

    it('should not inject if nothing exists at path', function () {
        const concepts = new Concepts({
            "$class+": {
                "$property*": {}
            },
            "#inject": {
                "return": "$returnType",
                "@path": "/$notfound"
            }
        });

        concepts.definition.should.deep.equal({
            "$class+": {
                "$property*": {}
            }
        });
    });

    it('should stop injecting when it hits a recursion', function () {
        (() => new Concepts({
            "root": "#recursion",
            "#recursion": {
                "recursion": "#recursion"
            },
            "#inject": {
                "@path": "/"
            }
        })).should.not.throw();
    });

    it('should inject to object arrays', function () {
        const concepts = new Concepts({
            "$class+": {
                "properties": [{}]
            },
            "#inject": {
                "return": "$returnType",
                "@path": "/**/properties"
            }
        });

        concepts.definition.should.deep.equal({
            "$class+": {
                "properties": [{
                    "return": "$returnType"
                }]
            }
        });
    });

    describe('multiple-paths', function () {
        const from = (path) => readTestCase(this, path);

        it('should inject to all paths', function () {
            const concepts = new Concepts(from('class-1.concepts.json'));

            concepts.definition.should.deep.equal(from('class-2.concepts.json'));
        });
    });

    describe('wildcard', function () {
        const from = (path) => readTestCase(this, path);

        it('should support wildcard paths', function () {
            const concepts = new Concepts(from('class.concepts.json'));

            concepts.definition.should.deep.equal(from('../multiple-paths/class-2.concepts.json'));
        });

        it('should not give error when injecting same definition multiple times', function () {
            const concepts = new Concepts({
                "$class+": {
                    "$property*": {},
                    "$method*": {}
                },
                "#inject": {
                    "return": "$returnType",
                    "@path": ["/*/$property", "/**/$method", "/*/$*"]
                }
            });

            concepts.definition.should.deep.equal(from('../multiple-paths/class-2.concepts.json'));
        });
    });

    describe('no-path', function () {
        const from = (path) => readTestCase(this, path);

        it('should inject to root when no path specified', function () {
            const concepts = new Concepts(from('class-1.concepts.json'));

            concepts.definition.should.deep.equal(from('class-2.concepts.json'));
        });
    });

    describe('multiple-injections', function () {
        const from = (path) => readTestCase(this, path);

        it('should process all of the injections', function () {
            const concepts = new Concepts(from('class-1.concepts.json'));

            concepts.definition.should.deep.equal(from('class-2.concepts.json'));
        });

        it('should only allow objects under injection array', function () {
            (() => new Concepts({
                "#inject": "test"
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.Inject_expects_an_object_or_an_array_of_objects__but_got_VALUE(
                        "test"
                    )
                ).message
            );

            (() => new Concepts({
                "#inject": ["test"]
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.Inject_expects_an_object_or_an_array_of_objects__but_got_VALUE(
                        "test"
                    )
                ).message
            );
        });
    });

    describe('order', function () {
        const from = (path) => readTestCase(this, path);

        it('should process injections in the order they appear', function () {
            const concepts = new Concepts(from('class-1.concepts.json'));

            concepts.definition.should.deep.equal(from('class-2.concepts.json'));
        });
    });

    describe('process-order', function () {
        const from = (path) => readTestCase(this, path);

        after(function () {
            fs.restore();
        })

        it('should process in the expected order', async function () {
            fs({
                'dto.concepts.json': JSON.stringify(from('dto.concepts.json')),
                'behavior.concepts.json': JSON.stringify(from('behavior.concepts.json'))
            });

            const concepts = await Concepts.load('behavior.concepts.json');

            concepts.definition.should.deep.equal(from('class.concepts.json'));
        });
    });
});