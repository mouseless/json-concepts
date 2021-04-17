const { Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('spec/basics/variables', function () {
    it('should validate schema 1', function () {
        const concepts = new Concepts({
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

    it('should validate schema 2',  function () {
        const concepts = new Concepts({
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
