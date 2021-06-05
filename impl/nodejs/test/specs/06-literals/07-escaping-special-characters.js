const { Concepts } = require('../../..');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/literals/escaping-special-characters', function () {
    const from = (path) => readTestCase(this, path);

    it('escapes special characters', function () {
        const concepts = new Concepts(from('escape.concepts.json'));

        (() => concepts.validate(from('concepts.escape.json')))
            .should.not.throw();
    });

    it('escapes escape character as well', function () {
        const concepts = new Concepts({
            "\\\\": "\\\\"
        });

        (() => concepts.validate({
            "\\": "\\"
        })).should.not.throw();
    });
});
