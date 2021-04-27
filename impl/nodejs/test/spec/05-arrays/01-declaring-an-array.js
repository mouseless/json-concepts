describe('spec/arrays/declaring-an-array', function () {
    it('should make variable one dimensional');
    it('should give error when more than one item exists in array definition');

    describe('arrays of concepts', function () {
        it('should make variable one dimensional');
    });

    describe('schemas', function () {
        it('should allow arrays as values');
        it('should give error when value has more dimensions than definition')
    });

    describe('single item', function () {
        it('should allow zero dimensions, but shadow should have it in array');
        it('should allow null, but treat it as a single item');
    });

    describe('multi-dimensional array', function () {
        it('should make variable a multi-dimensional array');
        it('should allow less dimensions all the way down to zero dimensions');
        it('should give error when more than one item exists in array definition');
    });
});
