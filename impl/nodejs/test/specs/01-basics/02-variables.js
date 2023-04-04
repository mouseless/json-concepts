const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/basics/variables', function () {
    const from = (path) => readTestCase(this, path);

    it('should validate schema 1', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting-1.service.json')))
            .should.not.throw();
    });

    it('should validate schema 2', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting-2.service.json')))
            .should.not.throw();
    });
});
