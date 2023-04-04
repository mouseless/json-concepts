const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/basics/shadows', function () {
    const from = (path) => readTestCase(this, path);

    it('should cast shadow', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
    });

    it('should have literal as leaf when no variable was given', function () {
        const concepts = new Concepts({
            '$service': {
                'response': 'string'
            }
        });

        concepts.shadow.should.deep.equal({
            'concept': {
                'name': 'service',
                'literal': {
                    'name': 'response',
                    'literal': {
                        'name': 'string'
                    }
                }
            }
        });
    });

    describe('schema-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should cast shadow', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });
});
