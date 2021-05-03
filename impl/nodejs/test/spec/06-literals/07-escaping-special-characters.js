const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

describe('spec/literals/escaping-special-characters', function () {
    it('it should escape special characters', function () {
        const concepts = new Concepts({
            "\\$service\\+": "\\$response"
        });

        (() => concepts.validate({
            "$service+": "$response"
        })).should.not.throw();
    });

    it('should escape escape character', function () {
        const concepts = new Concepts({
            "\\\\": "\\\\"
        });

        (() => concepts.validate({
            "\\": "\\"
        })).should.not.throw();
    });
});
