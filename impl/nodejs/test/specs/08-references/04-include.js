const { Concepts, Schema } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { readTestCase } = require('../../lib');

use(chaiAsPromised);
should();

describe('specs/references/include', function () {
    const from = (path) => readTestCase(this, path);

    after(function () {
        fs.restore();
    });

    it('should load definition', async function () {
        fs({
            'parameter.concepts.json': JSON.stringify(from('parameter.concepts.json')),
            'service-1.concepts.json': JSON.stringify(from('service-1.concepts.json'))
        });

        const concepts = await Concepts.load('service-1.concepts.json');

        concepts.definition.should.deep.equal(from('service-2.concepts.json'));
    });

    it('should load includes relative to concepts file', async function () {
        fs({
            'concepts/include/parameter.concepts.json': JSON.stringify({
                '$parameter*': '$type'
            }),
            'concepts/service.concepts.json': JSON.stringify({
                '$service+': {
                    '#include': 'include/parameter.concepts.json'
                }
            }),
            'schema/greeting.service.json': JSON.stringify({
                '@concepts': '../concepts/service.concepts.json',
                'sayHello': {
                    'name': 'string'
                }
            })
        });

        await Concepts.load('concepts/service.concepts.json')
            .should.not.be.rejected;

        await Schema.load('schema/greeting.service.json')
            .should.not.be.rejected;
    });

    it('should allow include local object', function () {
        const concepts = new Concepts({
            '$service+': {
                '#include': {
                    '$parameter*': '$type'
                }
            }
        });

        concepts.definition.should.deep.equal({
            '$service+': {
                '$parameter*': '$type'
            }
        });
    });

    it('should allow nested includes', async function () {
        fs({
            'parameter.concepts.json': JSON.stringify({
                '$parameter*': '$type'
            }),
            'method.concepts.json': JSON.stringify({
                '$method*': {
                    '#include': 'parameter.concepts.json'
                }
            }),
            'class.concepts.json': JSON.stringify({
                '$class+': {
                    '#include': 'method.concepts.json'
                }
            })
        });

        const concepts = await Concepts.load('class.concepts.json');

        concepts.definition.should.deep.equal({
            '$class+': {
                '$method*': {
                    '$parameter*': '$type'
                }
            }
        });
    });

    it('should load includes relative to included file', async function () {
        fs({
            'concepts/include/parameter.concepts.json': JSON.stringify({
                '$parameter*': '$type'
            }),
            'concepts/include/method.concepts.json': JSON.stringify({
                '$method*': {
                    '#include': 'parameter.concepts.json'
                }
            }),
            'concepts/class.concepts.json': JSON.stringify({
                '$class+': {
                    '#include': 'include/method.concepts.json'
                }
            }),
            'schema/user.class.json': JSON.stringify({
                '@concepts': '../concepts/class.concepts.json',
                'user': {
                    'login': {
                        'email': 'string',
                        'password': 'string'
                    }
                }
            })
        });

        await Concepts.load('concepts/class.concepts.json')
            .should.not.be.rejected;
        await Schema.load('schema/user.class.json')
            .should.not.be.rejected;
    });

    it('should give error when a conflict occurs', function () {
        (() => new Concepts({
            '#include': {
                'conflict': 'value a'
            },
            'conflict': 'value b'
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_assign_SOURCE_to_KEY__there_is_already_a_value__TARGET(
                    'value a', 'conflict', 'value b'
                )
            ).message
        );
    });

    describe('order', function () {
        const from = (path) => readTestCase(this, path);

        it('should process include before references', async function () {
            fs({
                'method.concepts.json': JSON.stringify(from('method.concepts.json')),
                'class-1.concepts.json': JSON.stringify(from('class-1.concepts.json'))
            });

            const concepts = await Concepts.load('class-1.concepts.json');

            concepts.definition.should.deep.equal(from('class-2.concepts.json'));
        });
    });

    describe('remote', function () {
        const from = (path) => readTestCase(this, path);

        after(async function () {
            nock.cleanAll();
        });

        it('should include from a url', async function () {
            nock('https://my-concepts.com')
                .get('/parameter.concepts.json')
                .reply(200, from('../parameter.concepts.json'))

                .get('/service.concepts.json')
                .reply(200, from('service.concepts.json'));

            const concepts = await Concepts.load('https://my-concepts.com/service.concepts.json');

            concepts.definition.should.deep.equal(from('../service-2.concepts.json'));
        });
    });
});
