const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/references/injections', function () {
    it('should inject definition to path', function () {
        const concepts = new Concepts({
            "$class+": {
                "$property*": {}
            },
            "#inject": {
                "return": "$returnType",
                "@path": "/$class/$property"
            }
        });

        concepts.definition.should.deep.equal({
            "$class+": {
                "$property*": {
                    "return": "$returnType"
                }
            }
        });
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
                because => because.Cannot_assign__conflict_occurs_on_KEY(
                    '$property*'
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

    describe('multiple paths', function () {
        it('should inject to all paths', function () {
            const concepts = new Concepts({
                "$class+": {
                    "$property*": {},
                    "$method*": {}
                },
                "#inject": {
                    "return": "$returnType",
                    "@path": ["/$class/$property", "/$class/$method"]
                }
            });

            concepts.definition.should.deep.equal({
                "$class+": {
                    "$property*": {
                        "return": "$returnType"
                    },
                    "$method*": {
                        "return": "$returnType"
                    }
                }
            })
        });
    });

    describe('wildcard support', function () {
        it('should support wildcard paths', function () {
            const concepts = new Concepts({
                "$class+": {
                    "$property*": {},
                    "$method*": {}
                },
                "#inject": {
                    "return": "$returnType",
                    "@path": ["/*/$property", "/**/$method"]
                }
            });

            concepts.definition.should.deep.equal({
                "$class+": {
                    "$property*": {
                        "return": "$returnType"
                    },
                    "$method*": {
                        "return": "$returnType"
                    }
                }
            });
        });

        it('should insert definition to all matching paths', function () {
            const concepts = new Concepts({
                "$level1": {
                    "$level2": {
                        "$level3": {}
                    }
                },
                "#inject": {
                    "$inject": "$value",
                    "@path": "/**"
                }
            });

            concepts.definition.should.deep.equal({
                "$level1": {
                    "$level2": {
                        "$level3": {
                            "$inject": "$value"
                        },
                        "$inject": "$value"
                    },
                    "$inject": "$value"
                }
            });
        });

        it('should not give error when injecting same definition multiple times');
    });

    describe('no path', function () {
        it('should inject to root when no path specified');
    });

    describe('multiple injections', function () {
        it('should process all of the injections');
        it('should only allow objects under injection array');
    });

    describe('order of injections', function () {
        it('should process injections in the order they appear');
    });

    describe('processing order', function () {
        it('waiting for specs');
    });
});