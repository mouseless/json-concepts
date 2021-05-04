describe('spec/references/injections', function () {
    it('should inject definition to path');
    it('should give error when conflict occurs');
    it('should not inject if nothing exists at path');

    describe('multiple paths', function () {
        it('should inject to all paths');
    });

    describe('wildcard support', function () {
        it('should support wildcard paths');
        it('should allow to escape wildcard characters');
    });

    describe('no path', function () {
        it('should inject to root when no path specified');
    });

    describe('multiple injections', function () {
        it('should process all of the injections');
        it('should only allow objects under injection array');
    });

    describe('order of injections', function () {
        it('should process injections in the order they appear');
    });
});