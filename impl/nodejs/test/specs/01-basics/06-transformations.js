const { Transformation, Concepts } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('specs/basics/transformations', function () {
    after(function () {
        fs.restore();
    });

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
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('response')
                ).message
            );
    });

    it('should verify that given source and target are compatible with transformation', function () {
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

        (() => new Transformation({
            "function": {
                "from": "service_",
                "select": {
                    "returnType": "responseType"
                }
            }
        }, source, target)).should.throw(error
            .Definition_is_not_compatible_with_its_CONCEPTS__REASON(
                'source', because => because.CONCEPT_not_found('service_')
            ).message
        );

        (() => new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType": "responseType_"
                }
            }
        }, source, target)).should.throw(error
            .Definition_is_not_compatible_with_its_CONCEPTS__REASON(
                'source', because => because.VARIABLE_not_found('responseType_')
            ).message
        );

        (() => new Transformation({
            "function_": {
                "from": "service",
                "select": {
                    "returnType": "responseType"
                }
            }
        }, source, target)).should.throw(error
            .Definition_is_not_compatible_with_its_CONCEPTS__REASON(
                'target', because => because.CONCEPT_not_found('function_')
            ).message
        );

        (() => new Transformation({
            "function": {
                "from": "service",
                "select": {
                    "returnType_": "responseType"
                }
            }
        }, source, target)).should.throw(error
            .Definition_is_not_compatible_with_its_CONCEPTS__REASON(
                'target', because => because.VARIABLE_not_found('returnType_')
            ).message
        );
    });

    it('should include path in error message when it is loaded', async function () {
        fs({
            'service.concepts.json': JSON.stringify({
                "$service": {
                    "response": "$responseType"
                }
            }),
            'client.concepts.json': JSON.stringify({
                "$function": {
                    "return": "$returnType"
                }
            }),
            'client.from.service.json': JSON.stringify({
                "function": {
                    "from": "service",
                    "select": {
                        "returnType_": "responseType"
                    }
                }
            })
        });

        const source = await Concepts.load('service.concepts.json');
        const target = await Concepts.load('client.concepts.json');

        await Transformation.load('client.from.service.json', source, target)
            .should.be.rejectedWith(
                error.TRANSFORMATION_is_not_valid__Error_is__ERROR(
                    'client.from.service.json',
                    error.Definition_is_not_compatible_with_its_CONCEPTS__REASON(
                        'target', because => because.VARIABLE_not_found('returnType_')
                    ).message
                ).message
            );
    });
});
