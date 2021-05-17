const { Concepts } = require("../../..");
const { error } = require("../../../src/util");
const { should } = require('chai');

should();

describe('specs/quantifiers/zero-or-one', function () {
    it('should validate schema 1', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter?": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {}
        })).should.not.throw();
    });

    it('should validate schema 2', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter?": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            }
        })).should.not.throw();
    });

    describe('more than one concept fails validation', function () {
        it('should give error', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter?": "$type"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "string",
                    "surname": "string"
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT('parameter', 1, 2)
                ).message
            );
        });
    })

    describe('key literals', function () {
        it('should validate', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter?": "$type",
                    "response?": "$responseType"
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "string"
                }
            })).should.not.throw();
        });
    });

    describe('concepts shadow', function () {
        it('should include quantifier information', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter?": "$type",
                    "response?": "$responseType"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "name": "service",
                    "literal": {
                        "name": "response",
                        "quantifier": { "min": 0, "max": 1 },
                        "variable": {
                            "name": "responseType"
                        }
                    },
                    "concept": {
                        "name": "parameter",
                        "quantifier": { "min": 0, "max": 1 },
                        "variable": {
                            "name": "type"
                        }
                    }
                }
            });
        });

        describe('schema shadow', function () {
            it('should set value to null for optional literals and', function () {
                const concepts = new Concepts({
                    "$service": {
                        "$parameter?": "$type",
                        "response?": "$responseType"
                    }
                });

                const schema = concepts.create({
                    "sayHello": {
                        "name": "string"
                    }
                });

                schema.shadow.should.deep.equal({
                    "service": {
                        "name": "sayHello",
                        "parameter": {
                            "name": "name",
                            "type": "string"
                        },
                        "responseType": null
                    }
                });
            });

            it('should set value to null for optional concepts', function () {
                const concepts = new Concepts({
                    "$service": {
                        "$parameter?": "$type",
                        "response?": "$responseType"
                    }
                });

                const schema = concepts.create({
                    "sayHello": {}
                });

                schema.shadow.should.deep.equal({
                    "service": {
                        "name": "sayHello",
                        "parameter": null,
                        "responseType": null
                    }
                });
            });
        });

        describe('null concepts', function () {
            it('should allow null when everything under that concept is optional', function () {
                const concepts = new Concepts({
                    "$service": {
                        "$parameter?": "$type",
                        "response?": "$responseType"
                    }
                });

                (() => concepts.validate({
                    "sayHello": null
                })).should.not.throw();
            });

            it('should include literal and concept keys even if they are not given', function () {
                const concepts = new Concepts({
                    "$service": {
                        "$parameter?": "$type",
                        "response?": "$responseType"
                    }
                });

                const schema = concepts.create({
                    "sayHello": null
                });

                schema.shadow.should.deep.equal({
                    "service": {
                        "name": "sayHello",
                        "parameter": null,
                        "responseType": null
                    }
                });
            });
        });
    });
});
