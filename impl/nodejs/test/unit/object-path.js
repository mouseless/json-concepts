const OP = require('../../src/object-path');
const { should } = require('chai');

should();

describe('object-path#find', function () {
    it('should accept empty path', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '')
            .should.deep.equal([
                { '$level1': { '$level2': { '$level3': {} } } },
            ]);
    });

    it('should accept /', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/')
            .should.deep.equal([
                { '$level1': { '$level2': { '$level3': {} } } },
            ]);
    });

    it('should accept /*', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/*')
            .should.deep.equal([
                { '$level2': { '$level3': {} } }
            ]);
    });

    it('should accept /**', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/**')
            .should.deep.equal([
                { '$level1': { '$level2': { '$level3': {} } } },
                { '$level2': { '$level3': {} } },
                { '$level3': {} },
                {},
            ]);
    });

    it('should accept /**/*', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/**/*')
            .should.deep.equal([
                { '$level2': { '$level3': {} } },
                { '$level3': {} },
                {},
            ]);
    });

    it('should accept /*/*', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/*/*')
            .should.deep.equal([
                { '$level3': {} }
            ]);
    });

    it('should accept /**/*2', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/**/*2')
            .should.deep.equal([
                { '$level3': {} }
            ]);
    });

    it('should accept /*1/**/*', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, '/*1/**/*')
            .should.deep.equal([
                { '$level3': {} },
                {}
            ]);
    });

    it('should allow multiple paths', function () {
        OP.find({ '$level1': { '$level2': { '$level3': {} } } }, ['/**/*2', '/**/*3'])
            .should.deep.equal([
                { '$level3': {} },
                {}
            ]);
    });

    it('should avoid circular objects', function () {
        const root = { 'root': {} };
        root.root = root;

        (() => OP.find(root, '/root')).should.not.throw();
    });

    it('should include arrays', function () {
        OP.find({ 'level1': [{ 'level2': { 'level3': {} } }] }, '/**')
            .should.deep.equal([
                { 'level1': [{ 'level2': { 'level3': {} } }] },
                { 'level2': { 'level3': {} } },
                { 'level3': {} },
                {},
            ]);
    });
});
