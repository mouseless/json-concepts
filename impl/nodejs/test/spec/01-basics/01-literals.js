describe('basics', function () {
    describe('literals', function () {
        describe('default case', async function () {
            const testing = await Concepts.load({
                "sayHello": {
                    "name": "string"
                }
            });

            it('should validate', function () {
                testing.validate({
                    "sayHello": {
                        "name": "string"
                    }
                }).should.equal(true);
            });

            it('should not validate if root keys does not exist', function () {
                testing.validate({
                }).should.equal(false);
            });

            it('should not validate if all schema is not the same recursively', function () {
                testing.validate({
                    "sayHello": {
                    }
                }).should.equal(false);
            });

            it('should not validate if schema has more things than concepts', function () {
                testing.validate({
                    "sayHello": {
                        "name": "string",
                        "surname": "string"
                    }
                }).should.equal(false);
            });

            it('should not validate if value side does not fit concepts literal', function () {
                testing.validate({
                    "sayHello": {
                        "name": "text"
                    }
                }).should.equal(false);
            });
        });
    });
});

const { Concepts } = require('../../../index');
const { should } = require('chai');

should();