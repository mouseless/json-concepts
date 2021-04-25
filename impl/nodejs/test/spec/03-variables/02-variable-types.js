const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/variables/variable-types', function() {
    it('should parse variable type', function() {
        const concepts = new Concepts({
            "$service+": {
                "$flag*": "$enabled:boolean"
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "service",
                "quantifier": { "min": 1 },
                "concept": {
                    "_": "flag",
                    "quantifier": { "min": 0 },
                    "variable": {
                        "_": "enabled",
                        "type": "boolean"
                    }
                }
            }
        });
    });

    it('should give error when type is not defined after :');
    it('should give error when given type is not supported');
    it('should validate variable values against types');

    describe('available variable types', function() {
        it('should support any');
        it('should support string');
        it('should support boolean');
        it('should support number');
        it('should allow any value when type is not specified');
    });
});