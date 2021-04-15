const { Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('spec/basics/literals', function () {
    it('should validate', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "string"
            }
        }).should.equal(true);
    });

    it('should not validate if parameter is null or undefined', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate().should.equal(false);
        concepts.validate(null).should.equal(false);
    });

    it('should not validate if root keys does not exist', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate({}).should.equal(false);
    });

    it('should not validate if all schema is not the same recursively', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate({
            "sayHello": {
            }
        }).should.equal(false);
    });

    it('should not validate if schema has more things than concepts', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "string",
                "surname": "string"
            }
        }).should.equal(false);
    });

    it('should not validate if value side does not fit concepts literal', function () {
        const concepts = new Concepts({
            "sayHello": {
                "name": "string"
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "text"
            }
        }).should.equal(false);
    });
});
