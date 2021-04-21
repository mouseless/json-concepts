describe('spec/quantifiers/one-or-more', function() {
    it('should allow more than one concept');

    describe('key literals', function() {
        it('should allow arrays as values of key literals');
        it('should give error when a non array was given as a value of literals');
    });

    describe('requires at least one', function() {
        it('should give error when at least one of that concept was not give');
        it('should give error when at least one item exists in array for literals');
    });

    describe('concepts shadow', function(){
        it('should not have max quantifier in shadow');
    });

    describe('schema shadow', function() {
        it('should have array instead of object for concept and literal value of the shadow');
    });
});