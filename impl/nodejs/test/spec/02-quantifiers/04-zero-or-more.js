describe('spec/quantifiers/zero-or-more', function() {
    it('should allow a concept to have one or many instances in schema');

    describe('key literals', function() {
        it('should allow a literal to not exist');
        it('should allow a literal to have an empty array');
        it('should give error when null or a non-array is given to a literal array');
    });

    describe('concepts shadow', function() {
        it('should have set quantifier min to zero');
    });

    describe('schema shadow', function() {
        it('should have empty arrays instead of null values');
    });
});