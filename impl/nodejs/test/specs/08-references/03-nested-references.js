const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/references/nested-references', function () {
    const from = (path) => readTestCase(this, path);

    it('should process references within references', function () {
        const concepts = new Concepts(from('class-1.concepts.json'));

        concepts.definition.should.deep.equal(from('class-2.concepts.json'));
    });

    describe('recursion', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow recursive definitions', function () {
            const concepts = new Concepts(from('tree.concepts.json'));
            const schema = concepts.create(from('organization.tree.json'));

            concepts.shadow.should.deep.equal(from('tree.concepts-shadow.json'));
            schema.shadow.should.deep.equal(from('organization.tree-shadow.json'));
        });

        it('should handle double self-reference', function () {
            let concepts;

            (() => concepts = new Concepts({
                '$root': '#node',
                '#node': {
                    '$node1*': '#node',
                    '$node2*': '#node'
                }
            })).should.not.throw();

            (() => concepts.create({
                'root': {}
            })).should.not.throw();

            (() => concepts = new Concepts({
                'root': '#node',
                '#node': {
                    'a?': '#node',
                    'b?': '#node'
                }
            })).should.not.throw();

            (() => concepts.create({
                'root': {}
            })).should.not.throw();
        });
    });

    describe('indirect', function () {
        const from = (path) => readTestCase(this, path);

        it('should detect recursion even if it is indirect', function () {
            const concepts = new Concepts(from('recursion.concepts.json'));

            concepts.shadow.should.deep.equal(from('recursion.concepts-shadow.json'));
        });
    });
});
