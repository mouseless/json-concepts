const { Concepts } = require('../../..');
const { should } = require('chai');

should();

describe('spec/variables/non-string-variables', function () {
    it('should set primitive values', function () {
        const concepts = new Concepts({
            "$service+": {
                "$flag*": "$enabled",
                "limit": "$limit"
            }
        });

        const schema = concepts.create({
            "sayGoodbye": {
                "async": true,
                "limit": 100
            }
        });

        schema.shadow.should.deep.equal({
            "service": [
                {
                    "name": "sayGoodbye",
                    "flag": [
                        {
                            "name": "async",
                            "enabled": true
                        }
                    ],
                    "limit": 100
                }
            ]
        });
    });
});
