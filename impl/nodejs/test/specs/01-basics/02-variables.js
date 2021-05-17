const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('specs/basics/variables', function () {
    it('should validate schema 1', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            }
        })).should.not.throw();
    });

    it('should validate schema 2',  function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "text"
            }
        })).should.not.throw();
    });
});
