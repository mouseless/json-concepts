const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/arrays/object-arrays', function () {
    it('should allow object arrays for literals');

    describe('schema', function () {
        it('should validate object arrays');
    });

    describe('literal and concept conflicts', function () {
        it('should give error when a concept and a literal share same name');
        it('should allow conflicting literal name under another concept');
        it('should not allow conflicting literal under same concept even if it is nested');
    });

    describe('concepts and object arrays', function () {
        it('should not allow object array under a concept');
        it('should not allow concept inside an object array');
    });
});