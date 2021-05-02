describe('spec/concepts/multi-concepts', function () {
    it('should allow more than one concept at the same level');

    describe('name conflicts', function () {
        it('should give error when two concepts share the same name');
    });

    describe('concepts resolution', function () {
        it('should set concept of a schema to the first validating concept');
        it('should give error when none of the concepts validate a schema');
    });

    describe('more than one match found', function () {
        it('should set the concept to the first one when more than one concept matches');
    });
});