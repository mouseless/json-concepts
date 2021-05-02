const { Schema } = require('../../..');
const { should } = require('chai');

should();

describe('spec/concepts/inline-concepts', function () {
    it('should load schema using inline concepts definition', function () {
        (() => new Schema({
            "@concepts": {
                "$service+": {
                    "$parameter*": "$type"
                }
            },
            "sayHello": {
                "name": "string",
                "surname": "string"
            }
        })).should.validate();
    });
});