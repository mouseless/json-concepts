const { Transformation, Schema, Concepts } = require('../../../index');
const { error } = require('../../../src/util');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('spec/basics/transformations', function () {
    it('should transform', function () {
        const source = new Concepts({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        const target = new Concepts({
            "$function": {
                "$argument": "$type",
                "return": "$returnType"
            }
        });

        const transformation = new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType": "responseType"
                }
            },
            "argument": {
                "from": "parameter",
                "select": {
                    "type": "type"
                }
            }
        }, source, target);

        const input = source.create({
            "sayHello": {
                "name": "string",
                "response": "string"
            }
        });

        const output = transformation.transform(input);

        output.definition.should.deep.equal({
            "sayHello": {
                "name": "string",
                "return": "string"
            }
        });
    });

    it('should give error when path is not supplied', async function () {
        await Transformation.load()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);
    });

    it('should give error when definition, source or target is not supplied to constructor', function () {
        (() => new Transformation())
            .should.throw(error.PARAMETER_is_required('definition').message);
        (() => new Transformation({}))
            .should.throw(error.PARAMETER_is_required('source').message);
        (() => new Transformation({}, new Concepts({})))
            .should.throw(error.PARAMETER_is_required('target').message);
    });

    it('should give error when schema is not supplied', function () {
        const transformation = new Transformation({}, new Concepts({}), new Concepts({}));

        (() => transformation.transform())
            .should.throw(error.PARAMETER_is_required('schema').message);
    });

    it('should create schema from source concepts when schema is an object', function () {
        const source = new Concepts({
            "$service": {
                "response": "$responseType"
            }
        });

        const target = new Concepts({
            "$function": {
                "return": "$returnType"
            }
        });

        const transformation = new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType": "responseType"
                }
            }
        }, source, target);

        const output = transformation.transform({
            "sayHello": {
                "response": "string"
            }
        });

        output.definition.should.deep.equal({
            "sayHello": {
                "return": "string"
            }
        });
    });

    it('should validate given schema against source concepts', function () {
        const source = new Concepts({
            "$service": {
                "response": "$responseType"
            }
        });

        const target = new Concepts({
            "$function": {
                "return": "$returnType"
            }
        });

        const transformation = new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType": "responseType"
                }
            }
        }, source, target);

        const targetInput = target.create({
            "sayHello": {
                "return": "string"
            }
        });

        (() => transformation.transform(targetInput))
            .should.throw(error.SCHEMA_is_not_valid('Schema').message);

    });

    it('should verify that given source and target are compatible with transformation');
});
