const { Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('basics', function () {
    describe('literals', function () {
        it('should validate', async function () {
            const concepts = await Concepts.load({
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

        it('should not validate if parameter is null or undefined', async function () {
            const concepts = await Concepts.load({
                "sayHello": {
                    "name": "string"
                }
            });

            concepts.validate().should.equal(false);
            concepts.validate(null).should.equal(false);
        });

        it('should not validate if root keys does not exist', async function () {
            const concepts = await Concepts.load({
                "sayHello": {
                    "name": "string"
                }
            });

            concepts.validate({}).should.equal(false);
        });

        it('should not validate if all schema is not the same recursively', async function () {
            const concepts = await Concepts.load({
                "sayHello": {
                    "name": "string"
                }
            });

            concepts.validate({
                "sayHello": {
                }
            }).should.equal(false);
        });

        it('should not validate if schema has more things than concepts', async function () {
            const concepts = await Concepts.load({
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

        it('should not validate if value side does not fit concepts literal', async function () {
            const concepts = await Concepts.load({
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
});
