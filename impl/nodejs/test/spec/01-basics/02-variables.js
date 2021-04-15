const { Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('spec/basics/variables', function () {
    it('should validate schema 1', async function () {
        const concepts = await Concepts.load({
            "sayHello": {
                "name": "$type"
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "string"
            }
        }).should.equal(true);
    });

    it('should validate schema 2', async function () {
        const concepts = await Concepts.load({
            "sayHello": {
                "name": "$type"
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "text"
            }
        }).should.equal(true);
    });
});
