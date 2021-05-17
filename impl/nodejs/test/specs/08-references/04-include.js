const { Concepts, Schema } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('specs/references/include', function () {
    after(function () {
        fs.restore();
    });

    it('should load definition', async function () {
        fs({
            'parameter.concepts.json': JSON.stringify({
                "$parameter*": "$type"
            }),
            'service.concepts.json': JSON.stringify({
                "$service+": {
                    "#include": "parameter.concepts.json"
                }
            })
        });

        const concepts = await Concepts.load('service.concepts.json');

        concepts.definition.should.deep.equal({
            "$service+": {
                "$parameter*": "$type"
            }
        });
    });

    it('should load includes relative to concepts file', async function () {
        fs({
            'concepts/include/parameter.concepts.json': JSON.stringify({
                "$parameter*": "$type"
            }),
            'concepts/service.concepts.json': JSON.stringify({
                "$service+": {
                    "#include": "include/parameter.concepts.json"
                }
            }),
            'schema/greeting.service.json': JSON.stringify({
                "@concepts": "../concepts/service.concepts.json",
                "sayHello": {
                    "name": "string"
                }
            })
        });

        await Concepts.load('concepts/service.concepts.json').should.not.be.rejected
        await Schema.load('schema/greeting.service.json').should.not.be.rejected
    });

    it('should allow include local object', function () {
        const concepts = new Concepts({
            "$service+": {
                "#include": {
                    "$parameter*": "$type"
                }
            }
        });

        concepts.definition.should.deep.equal({
            "$service+": {
                "$parameter*": "$type"
            }
        });
    });

    it('should allow nested includes', async function () {
        fs({
            'parameter.concepts.json': JSON.stringify({
                "$parameter*": "$type"
            }),
            'method.concepts.json': JSON.stringify({
                "$method*": {
                    "#include": "parameter.concepts.json"
                }
            }),
            'class.concepts.json': JSON.stringify({
                "$class+": {
                    "#include": "method.concepts.json"
                }
            })
        });

        const concepts = await Concepts.load('class.concepts.json');

        concepts.definition.should.deep.equal({
            "$class+": {
                "$method*": {
                    "$parameter*": "$type"
                }
            }
        });
    });

    it('should load includes relative to included file', async function () {
        fs({
            'concepts/include/parameter.concepts.json': JSON.stringify({
                "$parameter*": "$type"
            }),
            'concepts/include/method.concepts.json': JSON.stringify({
                "$method*": {
                    "#include": "parameter.concepts.json"
                }
            }),
            'concepts/class.concepts.json': JSON.stringify({
                "$class+": {
                    "#include": "include/method.concepts.json"
                }
            }),
            'schema/user.class.json': JSON.stringify({
                "@concepts": "../concepts/class.concepts.json",
                "user": {
                    "login": {
                        "email": "string",
                        "password": "string"
                    }
                }
            })
        });

        await Concepts.load('concepts/class.concepts.json').should.not.be.rejected
        await Schema.load('schema/user.class.json').should.not.be.rejected
    });

    it('should give error when a conflict occurs', function () {
        (() => new Concepts({
            "#include": {
                "conflict": "value a"
            },
            "conflict": "value b"
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_assign_SOURCE_to_KEY__there_is_already_a_value__TARGET(
                    'value a', 'conflict', 'value b'
                )
            ).message
        );
    });

    describe('processing order', function () {
        it('should process include before references', async function () {
            fs({
                'method.concepts.json': JSON.stringify({
                    "$method*": "#parameters & #return",
                    "#parameters": {
                        "$parameter*": "$type"
                    },
                    "#return": {
                        "returns": "$type"
                    }
                }),
                'class.concepts.json': JSON.stringify({
                    "$class+": "#properties & #methods",
                    "#properties": {
                        "$property*": "$type"
                    },
                    "#methods": {
                        "#include": "method.concepts.json"
                    }
                })
            });

            const concepts = await Concepts.load('class.concepts.json');

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
    });

    describe('including a remote file', function () {
        after(async function () {
            nock.cleanAll();
        });

        it('should include from a url', async function () {
            nock('https://json-concepts.github.io')
                .get('/samples/parameter.concepts.json')
                .reply(200, {
                    "$parameter*": "$type"
                })
                .get('/samples/service.concepts.json')
                .reply(200, {
                    "$service+": {
                        "#include": "https://json-concepts.github.io/samples/parameter.concepts.json"
                    }
                });

            const concepts = await Concepts.load('https://json-concepts.github.io/samples/service.concepts.json');

            concepts.definition.should.deep.equal({
                "$service+": {
                    "$parameter*": "$type"
                }
            });
        });
    });
});
