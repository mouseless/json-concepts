describe('spec/references/defining-a-reference', function () {
    it('should define a reference');
    it('should not affect shadow of a concepts definition');
    it('should allow to be used multiple times');
    it('should give error when a reference does not exist');
    it('should give error when a reference definition does not have a name');

    describe('references can only be defined at the root', function () {
        it('should give error when a referenced defined in a child node');
    });
});