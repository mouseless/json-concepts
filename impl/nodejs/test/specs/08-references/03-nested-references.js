const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('specs/references/nested-references', function () {
    it('should process references within references', function () {
        const concepts = new Concepts({
            "$class+": "#properties & #methods",
            "#properties": {
                "$property*": "$type"
            },
            "#methods": {
                "$method*": "#parameters & #return"
            },
            "#parameters": {
                "$parameter*": "$type"
            },
            "#return": {
                "returns": "$type"
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

    describe('recursion', function () {
        it('should allow recursive definitions', function () {
            const concepts = new Concepts({
                "$root": "#node",
                "#node": {
                    "$node*": "#node"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "name": "root",
                    "concept": {
                        "name": "node",
                        "quantifier": { "min": 0 },
                        "concept": { "reference": "node" }
                    }
                }
            });

            const schema = concepts.create({
                "ceo": {
                    "cfo": {
                        "accountant": {
                            "intern": null
                        }
                    },
                    "cto": {
                        "dba": null,
                        "developer": null
                    },
                    "coo": {
                        "representative": null
                    }
                }
            });

            schema.shadow.should.deep.equal({
                "root": {
                    "name": "ceo",
                    "node": [
                        {
                            "name": "cfo",
                            "node": [
                                {
                                    "name": "accountant",
                                    "node": [
                                        { "name": "intern", "node": [] }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "cto",
                            "node": [
                                { "name": "dba", "node": [] },
                                { "name": "developer", "node": [] }
                            ]
                        },
                        {
                            "name": "coo",
                            "node": [
                                { "name": "representative", "node": [] }
                            ]
                        }
                    ]
                }
            });
        });

        it('should handle double self-reference', function () {
            let concepts;

            (() => concepts = new Concepts({
                "$root": "#node",
                "#node": {
                    "$node1*": "#node",
                    "$node2*": "#node"
                }
            })).should.not.throw();

            (() => concepts.create({
                "root": {}
            })).should.not.throw();

            (() => concepts = new Concepts({
                "root": "#node",
                "#node": {
                    "a?": "#node",
                    "b?": "#node"
                }
            })).should.not.throw();

            (() => concepts.create({
                "root": {}
            })).should.not.throw();
        });
    });

    describe('indirect recursion', function () {
        it('should detect recursion even if it is indirect', function () {
            const concepts = new Concepts({
                "$root": "#a",
                "#a": {
                    "$a*": "#b"
                },
                "#b": {
                    "$b*": "#a"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "name": "root",
                    "concept": {
                        "name": "a",
                        "quantifier": { "min": 0 },
                        "concept": {
                            "name": "b",
                            "quantifier": { "min": 0 },
                            "concept": { "reference": "a" }
                        }
                    }
                }
            });
        });
    });
});
