describe('spec/quantifiers/zero-or-one', function () {
    it('should validate schema 1');
    it('should validate schema 2');

    describe('more than one concept fails validation', function () {
        it('should give error');
    })

    describe('key literals', function () {
        it('should validate');
    });

    describe('concepts shadow', function () {
        it('should include quantifier information');
    });

    describe('schema shadow', function() {
        it('should set value to null for optional literals');
        it('should set value to null for optional concepts');
    });

    describe('null concepts', function() {
        it('should allow null when everything under that concept is optional');
        it('should include literal and concept keys even if they are not given');
    });
});