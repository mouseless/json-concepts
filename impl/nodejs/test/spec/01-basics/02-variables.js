describe('basics', function () {
    describe('variables', function () {
        describe('default case', async function () {
            const testing = await Concepts.load({
                "sayHello": {
                    "name": "$type"
                }
            });

            it('should validate schema 1', function () {
                testing.validate({
                    "sayHello": {
                        "name": "string"
                    }
                }).should.equal(true);
            });

            it('should validate schema 2', function () {
                testing.validate({
                    "sayHello": {
                        "name": "text"
                    }
                }).should.equal(true);
            });
        });
    });
});

const { Concepts } = require('../../../index');
const { should } = require('chai');

should();
