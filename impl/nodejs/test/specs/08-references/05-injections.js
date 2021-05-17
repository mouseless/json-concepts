const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');

should();

describe('specs/references/injections', function () {
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

    it('include should stop when it hits a recursion', function () {
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
    });

    describe('no path', function () {
        it('should inject to root when no path specified', function () {
            const concepts = new Concepts({
                "#inject": {
                    "$class+": {}
                }
            });

            concepts.definition.should.deep.equal({
                "$class+": {}
            });
        });
    });

    describe('multiple injections', function () {
        it('should process all of the injections', function () {
            const concepts = new Concepts({
                "#inject": [
                    {
                        "$class+": {}
                    },
                    {
                        "$property+": {},
                        "@path": "/**/$class",
                    },
                    {
                        "$method+": {},
                        "@path": "/**/$class",
                    },
                    {
                        "returns": "$returnType",
                        "@path": ["/**/$method", "/**/$property"],
                    },
                    {
                        "$parameter*": "$type",
                        "@path": "/**/$method"
                    }
                ]
            });

            concepts.definition.should.deep.equal({
                "$class+": {
                    "$property+": {
                        "returns": "$returnType"
                    },
                    "$method+": {
                        "$parameter*": "$type",
                        "returns": "$returnType"
                    }
                }
            });
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

    describe('order of injections', function () {
        it('should process injections in the order they appear', function () {
            const concepts = new Concepts({
                "#inject": [
                    {
                        "$parameter*": "$type",
                        "@path": "/**/$method"
                    },
                    {
                        "returns": "$returnType",
                        "@path": ["/**/$method", "/**/$property"],
                    },
                    {
                        "$method+": {},
                        "@path": "/**/$class",
                    },
                    {
                        "$property+": {},
                        "@path": "/**/$class",
                    },
                    {
                        "$class+": {}
                    }
                ]
            });

            concepts.definition.should.deep.equal({
                "$class+": {}
            });
        });
    });

    describe('processing order', function () {
        after(function () {
            fs.restore();
        })

        it('should process in the expected order', async function () {
            fs({
                'dto.concepts.json': JSON.stringify({
                    "$class+": "#properties",
                    "#properties": {
                        "$property+": {}
                    }
                }),
                'behavior.concepts.json': JSON.stringify({
                    "#include": "dto.concepts.json",
                    "#inject": [
                        {
                            "$method+": "#parameters",
                            "#parameters": {
                                "$parameter*": "$type"
                            },
                            "@path": "/**/$class",
                        },
                        {
                            "returns": "$returnType",
                            "@path": ["/**/$method", "/**/$property"],
                        }
                    ]
                })
            });

            const concepts = await Concepts.load('behavior.concepts.json');

            concepts.definition.should.deep.equal({
                "$class+": {
                    "$property+": {
                        "returns": "$returnType"
                    },
                    "$method+": {
                        "$parameter*": "$type",
                        "returns": "$returnType"
                    }
                }
            });
        });
    });
});